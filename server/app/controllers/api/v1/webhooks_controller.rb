class Api::V1::WebhooksController < ActionController::Base
  skip_before_action :verify_authenticity_token, raise: false
  skip_before_action :authenticate_user!, raise: false
  before_action :verify_mercadopago_request

  def mercadopago
    resource_id = params[:id] || params.dig(:data, :id)
    topic = params[:topic] || params[:type]

    if topic == "payment" && resource_id.present?
      begin
        sdk = Mercadopago::SDK.new(ENV.fetch("MP_ACCESS_TOKEN", nil))
        payment_response = sdk.payment.get(resource_id)
        payment = payment_response[:response]

        if payment && payment["status"] == "approved"
          order_id = payment["external_reference"]
          order = Order.find_by(id: order_id)
          order&.update(status: :paid, payment_status: "approved")
        end
      rescue => e
        Rails.logger.error "Mercadopago webhook error: #{e.message}"
      end
    end

    render json: { status: "ok" }, status: :ok
  end

  private

  def verify_mercadopago_request
    # Add IP verification in production
    true
  end
end
