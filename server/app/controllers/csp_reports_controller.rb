# Receives Content Security Policy violation reports sent by browsers when
# something on the page violates the policy declared in security_headers.rb.
# See https://guides.rubyonrails.org/security.html#content-security-policy
class CspReportsController < ActionController::Base
  # CSP reports are POSTed without a CSRF token; the endpoint only logs.
  skip_before_action :verify_authenticity_token, raise: false

  def create
    report = params[:csp-report].presence || request.raw_post
    Rails.logger.warn("[CSP] violation ip=#{request.remote_ip} report=#{report.inspect}")
    head :no_content
  end
end
