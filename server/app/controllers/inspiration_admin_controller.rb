class InspirationAdminController < ActionController::Base
  protect_from_forgery with: :exception

  # Ensure session-related modules are available
  include ActionController::Cookies
  include ActionController::Session
  include ActionController::Flash
end
