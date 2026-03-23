# LEGACY NOTICE: this root Rails app is preserved for compatibility only.
# Active development and deploy target the `server/` backend.

# This file is used by Rack-based servers to start the application.

require_relative "config/environment"

run Rails.application
Rails.application.load_server
