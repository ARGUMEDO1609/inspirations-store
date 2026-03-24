require "mercadopago"

class Api::V1::PaymentsController < Api::V1::ApiController
  before_action :authenticate_user!

  def create_preference
    @order = current_user.orders.find(params[:id])

    if @order.order_items.empty?
      render_error("Order has no items")
      return
    end

    unless @order.pending?
      render_error("Order is not available for payment")
      return
    end

    sdk = Mercadopago::SDK.new(ENV["MP_ACCESS_TOKEN"] || "TEST-9140410657904033-030213-9a0d8e8b8b8b8b8b8b8b8b8-12345678")

    preference_response = sdk.preference.create(preference_data)
    preference = preference_response[:response]

    if preference.blank? || preference["id"].blank? || preference["init_point"].blank?
      render_error("Could not create payment preference")
      return
    end

    @order.update!(payment_id: preference["id"])

    render_success(data: { preference_id: preference["id"], checkout_url: preference["init_point"] }, message: "Payment preference created")
  end

  private

  def preference_data
    {
      items: serialized_items,
      back_urls: {
        success: "#{frontend_url}/payment/success",
        failure: "#{frontend_url}/payment/failure",
        pending: "#{frontend_url}/payment/pending"
      },
      auto_return: "approved",
      external_reference: @order.id.to_s,
      notification_url: "#{backend_url}/api/v1/webhooks/mercadopago"
    }
  end

  def serialized_items
    @order.order_items.map do |item|
      {
        title: item.product.title,
        unit_price: item.unit_price.to_f,
        quantity: item.quantity,
        currency_id: "ARS"
      }
    end
  end

  def frontend_url
    ENV["FRONTEND_URL"].presence || "http://localhost:5173"
  end

  def backend_url
    ENV["BACKEND_URL"].presence || request.base_url
  end
end
