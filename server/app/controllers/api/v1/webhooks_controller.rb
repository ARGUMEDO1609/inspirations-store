class Api::V1::WebhooksController < ActionController::Base
  skip_before_action :verify_authenticity_token, raise: false
  skip_before_action :authenticate_user!, raise: false
  before_action :verify_mercadopago_request

  def mercadopago
    resource_id = params[:id] || params.dig(:data, :id)
    topic = params[:topic] || params[:type]

    process_payment_notification(resource_id) if topic == 'payment' && resource_id.present?

    render json: { status: 'ok' }, status: :ok
  end

  private

  def process_payment_notification(resource_id)
    sdk = Mercadopago::SDK.new(ENV.fetch('MP_ACCESS_TOKEN', nil))
    payment_response = sdk.payment.get(resource_id)
    payment = payment_response[:response]
    return unless payment

    order = find_order_for_payment(payment)
    return unless order

    order.apply_payment_update!(
      payment_id: payment['id']&.to_s,
      payment_status: payment['status']
    )
  rescue => e
    Rails.logger.error "Mercadopago webhook error: #{e.message}"
  end

  def find_order_for_payment(payment)
    order_reference = payment['external_reference']
    return Order.find_by(id: order_reference) if order_reference.present?

    Order.find_by(payment_id: payment['id']&.to_s)
  end

  def verify_mercadopago_request
    true
  end
end
