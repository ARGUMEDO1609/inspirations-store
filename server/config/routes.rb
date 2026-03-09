Rails.application.routes.draw do
  get "favicon.ico", to: proc { [ 204, {}, [] ] }
  devise_for :admin_users, ActiveAdmin::Devise.config
  get "up" => "rails/health#show", as: :rails_health_check

  root to: proc { [ 200, { "Content-Type" => "text/html" }, [ '<body style="background: #020617; color: #f59e0b; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;"><h1>Inspiration Store API OK</h1></body>' ] ] }

  # ActiveAdmin Routes
  ActiveAdmin.routes(self)

  # Authentication
  devise_for :users, path: "", path_names: {
    sign_in: "login",
    sign_out: "logout",
    registration: "signup"
  },
  controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }

  namespace :api do
    namespace :v1 do
      get "current_user", to: "users#show_current"

      resources :categories do
        resources :products, only: [ :index ]
      end

      resources :products

      resources :cart_items do
        collection do
          delete "clear"
        end
      end

      resources :orders, only: [ :index, :show, :create, :update ] do
        member do
          get "pay", to: "payments#create_preference"
        end
      end

      # MercadoPago Webhook
      post "webhooks/mercadopago", to: "webhooks#mercadopago"
    end
  end

  # Catch-all for browser requests (only if not a rails internal route)
  get "*path", to: proc { [ 204, {}, [] ] }, constraints: lambda { |req| !req.path.start_with?("/rails/") }
end
