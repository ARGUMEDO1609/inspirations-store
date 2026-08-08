# frozen_string_literal: true

# Authentication helper for request specs using cookie-based sessions.
#
# Uses ActionDispatch::Integration::Session which properly maintains cookies
# across requests, unlike the default Rack::Test session.
module AuthHelper
  def authenticated_session(user, password: "password123")
    session = ActionDispatch::Integration::Session.new(Rails.application)
    session.host! "localhost"
    session.post "/api/v1/login", params: { user: { email: user.email, password: password } }, as: :json
    expect(session.status).to eq(200)
    session
  end

  # For tests that need to make requests without authentication
  def anonymous_session
    session = ActionDispatch::Integration::Session.new(Rails.application)
    session.host! "localhost"
    session
  end
end

RSpec.configure do |config|
  config.include AuthHelper, type: :request
end