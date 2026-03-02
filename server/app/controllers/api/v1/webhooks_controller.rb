class Api::V1::WebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def mercadopago
    # Verificación de IPN / Webhook
    # Documentación: https://www.mercadopago.com.ar/developers/es/docs/notifications/webhooks
    
    resource_id = params[:id] || params.dig(:data, :id)
    topic = params[:topic] || params[:type]

    if topic == 'payment'
      sdk = Mercadopago::SDK.new(ENV['MP_ACCESS_TOKEN'])
      payment_response = sdk.payment.get(resource_id)
      payment = payment_response[:response]

      if payment['status'] == 'approved'
        order_id = payment['external_reference']
        order = Order.find(order_id)
        order.update(status: :paid, payment_status: 'approved')
      end
    end

    render json: { status: 'ok' }, status: :ok
  end
end
