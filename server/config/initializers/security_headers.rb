# frozen_string_literal: true

Rails.application.config.action_dispatch.default_headers = {
  "X-Frame-Options" => "DENY",
  "X-Content-Type-Options" => "nosniff",
  "X-XSS-Protection" => "0",
  "Referrer-Policy" => "strict-origin-when-cross-origin",
  "Permissions-Policy" => "camera=(), microphone=(), geolocation=(), payment=()",
  "Cross-Origin-Opener-Policy" => "same-origin",
  "Cross-Origin-Resource-Policy" => "same-origin"
}

# Content Security Policy
Rails.application.config.content_security_policy do |policy|
  policy.default_src :self, :https
  policy.font_src    :self, :https, :data
  policy.img_src     :self, :https, :data, :blob
  policy.object_src  :none
  policy.script_src  :self, :https
  policy.style_src   :self, :https, :unsafe_inline
  policy.connect_src :self, :https, :wss
  policy.frame_src   :none
  policy.base_uri    :self
  policy.form_action :self
  policy.frame_ancestors :none

  # Relax for development
  if Rails.env.development?
    policy.script_src  :self, :https, :unsafe_eval, :unsafe_inline
    policy.style_src   :self, :https, :unsafe_inline
    policy.connect_src :self, :https, :wss, "http://localhost:*", "ws://localhost:*"
  end
end

# Report CSP violations in production
if Rails.env.production?
  Rails.application.config.content_security_policy_report_only = false
  Rails.application.config.content_security_policy_report_uri = "/csp-report"
end