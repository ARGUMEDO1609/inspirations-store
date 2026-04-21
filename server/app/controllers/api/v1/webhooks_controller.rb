require "securerandom"

class Api::V1::WebhooksController < ActionController::Base
  skip_before_action :verify_authenticity_token, raise: false
  skip_before_action :authenticate_user!, raise: false
  before_action :verify_wompi_signature

  def wompi
    raw_body = request.raw_post
    payload = JSON.parse(raw_body)
    transaction = payload.dig("data", "transaction") || {}
    reference = transaction["reference"]
    order = find_order_by_reference(reference)
    payment_status = map_wompi_status(transaction["status"])

    Rails.logger.info "Received Wompi event: reference=#{reference.inspect} status=#{transaction['status']}"

    if order && payment_status.present?
      transaction_id = transaction["id"].presence || "wompi-#{SecureRandom.hex(6)}"

      order.transaction do
        order.payments.create!(
          provider: "wompi",
          transaction_id: transaction_id,
          status: transaction["status"]
        )

        order.apply_payment_update!(
          payment_id: transaction["id"],
          payment_status: payment_status
        )
      end
    else
      Rails.logger.warn(
        "Could not apply Wompi update: reference=#{reference.inspect} status=#{transaction['status'].inspect} payment_status=#{payment_status.inspect}"
      )
    end

    render json: { status: "ok" }, status: :ok
  rescue JSON::ParserError => e
    Rails.logger.error "Wompi webhook JSON error: #{e.message}"
    render json: { status: "error", message: "Invalid payload" }, status: :bad_request
  rescue => e
    Rails.logger.error "Wompi webhook processing error: #{e.message}"
    render json: { status: "error", message: "Internal server error" }, status: :internal_server_error
  end

  private

  def find_order_by_reference(reference)
    return nil unless reference.present?

    Order.find_by(reference: reference)
  end

  def map_wompi_status(value)
    normalized = value.to_s.downcase
    case normalized
    when "approved"
      "approved"
    when "pending"
      "pending"
    when "declined", "error"
      "rejected"
    when "voided"
      "cancelled"
    else
      normalized.presence
    end
  end

  def verify_wompi_signature
    unless Wompi::WebhookValidator.valid?(body: request.raw_post, headers: request.headers)
      render json: { status: "error", message: "Invalid signature" }, status: :unauthorized
    end
  end
end
