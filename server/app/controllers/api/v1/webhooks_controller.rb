class Api::V1::WebhooksController < ActionController::Base
  skip_before_action :verify_authenticity_token, raise: false
  skip_before_action :authenticate_user!, raise: false
  before_action :verify_epayco_signature

  def epayco
    invoice_id = params[:x_id_invoice]
    x_response = params[:x_response] || params[:x_cod_response]
    ref_payco = params[:x_ref_payco]
    transaction_id = params[:x_transaction_id]

    Rails.logger.info "Received ePayco webhook: invoice=#{invoice_id}, status=#{x_response}, ref=#{ref_payco}"

    order = find_order_by_invoice(invoice_id)
    payment_status = map_epayco_status(x_response)

    if order && payment_status.present?
      order.apply_payment_update!(
        payment_id: ref_payco.presence || transaction_id,
        payment_status: payment_status
      )
    else
      Rails.logger.warn(
        "Could not apply ePayco update: order=#{invoice_id.inspect} status=#{x_response.inspect} payment_status=#{payment_status.inspect}"
      )
    end

    render json: { status: "ok" }, status: :ok
  rescue => e
    Rails.logger.error "ePayco webhook processing error: #{e.message}"
    render json: { status: "error", message: "Internal server error" }, status: :internal_server_error
  end

  private

  def find_order_by_invoice(invoice)
    return nil unless invoice.present?
    Order.find_by(id: invoice)
  end

  def map_epayco_status(value)
    normalized = value.to_s.downcase
    case normalized
    when /acept/, "approved"
      "approved"
    when /pend/
      "pending"
    when /rechaz/
      "rejected"
    when /fall/
      "cancelled"
    when "cancelled", "rejected"
      normalized
    else
      normalized.presence
    end
  end

  def verify_epayco_signature
    return if Epayco::WebhookValidator.valid_signature?(params)

    render json: { status: "error", message: "Invalid signature" }, status: :unauthorized
  end
end
