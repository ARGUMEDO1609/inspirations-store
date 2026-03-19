require "mercadopago"

class Api::V1::PaymentsController < Api::V1::ApiController
  before_action :authenticate_user!

  def create_preference
    @order = current_user.orders.find(params[:id])

    sdk = Mercadopago::SDK.new(ENV["MP_ACCESS_TOKEN"] || "TEST-9140410657904033-030213-9a0d8e8b8b8b8b8b8b8b8b8-12345678")

    items = @order.order_items.map do |item|
      {
        title: item.product.title,
        unit_price: item.unit_price.to_f,
        quantity: item.quantity,
        currency_id: "ARS"
      }
    end

    preference_data = {
      items: items,
      back_urls: {
        success: "#{ENV['FRONTEND_URL']}/payment/success",
        failure: "#{ENV['FRONTEND_URL']}/payment/failure",
        pending: "#{ENV['FRONTEND_URL']}/payment/pending"
      },
      auto_return: "approved",
      external_reference: @order.id.to_s,
      notification_url: "#{ENV['BACKEND_URL']}/api/v1/webhooks/mercadopago"
    }

    preference_response = sdk.preference.create(preference_data)
    preference = preference_response[:response]

    @order.update(payment_id: preference["id"])

    render json: { preference_id: preference["id"], checkout_url: preference["init_point"] }
  end
end
