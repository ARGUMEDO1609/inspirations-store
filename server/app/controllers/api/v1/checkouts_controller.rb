class Api::V1::CheckoutsController < Api::V1::ApiController
  before_action :authenticate_user!

  def create
    order = Orders::CreateFromCart.new(
      user: current_user,
      shipping_address: checkout_params[:shipping_address],
      payment_method: :card,
      source_client_id: request.headers["X-Client-Instance-Id"]
    ).call

    checkout_url = Wompi::WebCheckoutUrl.build(
      order: order,
      frontend_url: frontend_url
    )

    render_success(
      data: { checkout_url: checkout_url },
      message: "Checkout preparado",
      status: :created
    )
  rescue Orders::CreateFromCart::EmptyCart
    render_error("Cart is empty")
  rescue Orders::CreateFromCart::InsufficientStock => e
    render_error("Insufficient stock for #{e.product&.title}")
  rescue Orders::CreateFromCart::InvalidPaymentMethod => e
    render_error(e.message)
  rescue Wompi::WebCheckoutUrl::Error => e
    Rails.logger.error "Wompi redirect creation error: #{e.message}"
    render_error("No pudimos preparar el pago", details: e.message)
  rescue ActiveRecord::RecordInvalid => e
    render_validation_errors(e.record.errors.full_messages)
  end

  private

  def checkout_params
    params.require(:checkout).permit(:shipping_address)
  end

  def frontend_url
    ENV["FRONTEND_URL"].to_s.strip.presence || "http://localhost:5173"
  end
end
