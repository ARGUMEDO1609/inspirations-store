require_relative "boot"

require "rails/all"
require "sprockets/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Server
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.1

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    # To support ActiveAdmin's UI, we must allow views and helpers
    config.api_only = false

    # Use ImageMagick (via mini_magick) instead of libvips for ActiveStorage
    # variants, since libvips on this system is too old (8.13+ required).
    config.active_storage.variant_processor = :mini_magick


    # ActiveAdmin requires sessions, cookies, and flash. The cookie session
    # store itself is configured in config/initializers/session_store.rb
    # (HttpOnly + Secure + SameSite). These middleware inserts ensure cookies
    # and flash are available on the API too, and play well with ActiveAdmin.
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Flash
    config.middleware.use Rack::MethodOverride
  end
end
