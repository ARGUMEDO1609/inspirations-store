# Be sure to restart your server when you modify this file.

require "pathname"

# Add additional assets to the asset pipeline
Rails.application.config.assets.paths << Rails.root.join("node_modules")
Rails.application.config.assets.paths << Rails.root.join("app/assets/builds")
Rails.application.config.assets.paths << Pathname.new(Gem.loaded_specs["activeadmin"].full_gem_path).join("app/assets")

# Precompile additional assets (CSS uses Tailwind build, JS uses importmaps in AA4)
Rails.application.config.assets.precompile += %w[active_admin.css active_admin/print.css]

# Tailwind v4 already outputs minified CSS using modern syntax that the SassC
# compressor (pulled in by sassc-rails) cannot parse. Disable CSS compression so
# assets:precompile does not run the built stylesheet through SassC.
Rails.application.config.assets.css_compressor = nil
