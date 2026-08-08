class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_FROM", "no-reply@inspirationstore.co")
  layout "mailer"
end
