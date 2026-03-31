module ApiResponses
  extend ActiveSupport::Concern

  ERROR_CODES = {
    bad_request: 'bad_request',
    unauthorized: 'unauthorized',
    forbidden: 'forbidden',
    not_found: 'not_found',
    unprocessable_entity: 'validation_failed',
    internal_server_error: 'internal_error'
  }.freeze

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

  def render_error(message, status: :unprocessable_entity, code: nil, details: nil)
    status_key = status.to_s.to_sym
    response = {
      success: false,
      error: message,
      error_code: code || ERROR_CODES[status_key] || status_key.to_s
    }
    response[:details] = details if details.present?

    render json: response, status: status
  end

  def render_validation_errors(errors)
    render_error(
      'Validation failed',
      status: :unprocessable_entity,
      code: ERROR_CODES[:unprocessable_entity],
      details: Array(errors)
    )
  end

  def render_not_found(message = 'Resource not found')
    render_error(message, status: :not_found)
  end

  def render_unauthorized(message = 'Unauthorized')
    render_error(message, status: :unauthorized)
  end

  def render_forbidden(message = 'You are not authorized to perform this action')
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
