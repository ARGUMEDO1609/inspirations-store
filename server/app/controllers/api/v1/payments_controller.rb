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

    session_info = Epayco::SessionCreator.create_session!(
      order: @order,
      frontend_url: frontend_url,
      backend_url: backend_url
    )

    render_success(
      data: {
        session_id: session_info[:session_id],
        amount: session_info[:amount],
        currency: session_info[:currency]
      },
      message: "Sesión de pago creada"
    )
  rescue Epayco::SessionCreator::Error => e
    Rails.logger.error "ePayco session creation error: #{e.message}"
    render_error("No pudimos preparar el pago", details: e.message)
  rescue ActiveRecord::RecordNotFound
    render_not_found("Order not found")
  rescue => e
    Rails.logger.error "Payment processing error: #{e.message}"
    render_error("Payment processing error")
  end

  private

  def frontend_url
    ENV["FRONTEND_URL"].presence || "http://localhost:5173"
  end

  def backend_url
    ENV["BACKEND_URL"].presence || request.base_url
  end
end
