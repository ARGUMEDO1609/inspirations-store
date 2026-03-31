class Api::V1::WebhooksController < ActionController::Base
  skip_before_action :verify_authenticity_token, raise: false
  skip_before_action :authenticate_user!, raise: false
  before_action :verify_mercadopago_signature

  def mercadopago
    resource_id = params[:id] || params.dig(:data, :id)
    topic = params[:topic] || params[:type]

    Rails.logger.info "Received Mercado Pago webhook: topic=#{topic}, resource_id=#{resource_id}"

    process_payment_notification(resource_id) if topic == "payment" && resource_id.present?

    render json: { status: "ok" }, status: :ok
  rescue => e
    Rails.logger.error "Mercadopago webhook processing error: #{e.message}"
    render json: { status: "error", message: "Internal server error" }, status: :internal_server_error
  end

  private

  def process_payment_notification(resource_id)
    Rails.logger.info "Processing Mercado Pago payment notification for resource_id: #{resource_id}"

    sdk = Mercadopago::SDK.new(ENV.fetch("MP_ACCESS_TOKEN", nil))
    payment_response = sdk.payment.get(resource_id)
    payment = payment_response[:response]

    unless payment
      Rails.logger.warn "Could not retrieve payment details for resource_id: #{resource_id}"
      return
    end

    order = find_order_for_payment(payment)
    unless order
      Rails.logger.warn "Could not find order for payment resource_id: #{resource_id}, external_reference: #{payment['external_reference']}"
      return
    end

    Rails.logger.info "Updating order #{order.id} with payment status: #{payment['status']}"

    order.apply_payment_update!(
      payment_id: payment["id"]&.to_s,
      payment_status: payment["status"]
    )

    Rails.logger.info "Mercadopago webhook processed successfully for order #{order.id} with payment status #{payment['status']}"
  rescue => e
    Rails.logger.error "Mercadopago webhook error processing payment #{resource_id}: #{e.message}"
    raise e
  end

  def find_order_for_payment(payment)
    order_reference = payment["external_reference"]
    if order_reference.present?
      order = Order.find_by(id: order_reference)
      Rails.logger.debug "Found order by external_reference: #{order_reference}" if order
      return order
    end

    order = Order.find_by(payment_id: payment["id"]&.to_s)
    Rails.logger.debug "Found order by payment_id: #{payment['id']}" if order
    order
  end

  def verify_mercadopago_signature
    # For now, we'll accept all requests as we're in development
    # In production, you should verify the x-signature header
    # signature = request.headers['x-signature']
    # # Verify signature using Mercado Pago's secret key
    # unless valid_mercadopago_signature?(signature, request.raw_post)
    #   render json: { status: 'error', message: 'Invalid signature' }, status: :unauthorized
    # end
    true
  end

  # This method should be implemented with actual signature verification logic
  # def valid_mercadopago_signature?(signature, payload)
  #   # Implementation would go here using Mercado Pago's secret key
  #   # This is a placeholder for the actual implementation
  #   true
  # end
end
