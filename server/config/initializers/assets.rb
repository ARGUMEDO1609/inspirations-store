# Be sure to restart your server when you modify this file.

require "pathname"

# Add additional assets to the asset pipeline
Rails.application.config.assets.paths << Rails.root.join("node_modules")
Rails.application.config.assets.paths << Pathname.new(Gem.loaded_specs["activeadmin"].full_gem_path).join("app/assets")

# Precompile additional assets.
Rails.application.config.assets.precompile += %w[active_admin.js active_admin.css]
Rails.application.config.assets.precompile += %w[active_admin/print.css]
