class InspirationAdminController < ActionController::Base
  protect_from_forgery with: :exception

  # Session handling is provided by middleware on ActionController::Base; there is
  # no ActionController::Session module to include (it raised on eager load in prod).
  include ActionController::Cookies
  include ActionController::Flash
end
