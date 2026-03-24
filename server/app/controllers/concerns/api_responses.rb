module ApiResponses
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
    rescue_from ActionController::ParameterMissing, with: :parameter_missing
  end

  def render_success(data: nil, message: nil, status: :ok)
    response = { success: true }
    response[:data] = data if data.present?
    response[:message] = message if message.present?

    render json: response, status: status
  end

  def render_error(message, status: :unprocessable_entity, details: nil)
    response = { success: false, error: message }
    response[:details] = details if details.present?

    render json: response, status: status
  end

  def render_validation_errors(errors)
    response = {
      success: false,
      error: "Validation failed",
      errors: errors
    }

    render json: response, status: :unprocessable_entity
  end

  def render_not_found(message = "Resource not found")
    render_error(message, status: :not_found)
  end

  def render_unauthorized(message = "Unauthorized")
    render_error(message, status: :unauthorized)
  end

  def render_forbidden(message = "You are not authorized to perform this action")
    render_error(message, status: :forbidden)
  end

  private

  def record_not_found(exception)
    render_not_found(exception.message)
  end

  def parameter_missing(exception)
    render_error("Parameter missing: #{exception.param}", status: :bad_request)
  end
end
