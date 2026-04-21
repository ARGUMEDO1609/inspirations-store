# Rails 8.1+ warns when route DSL helpers receive option hashes positionally.
# Devise 5.0.3 still defines a few route helpers that call `resource` that way.
module DeviseRouteKeywords
  def devise_session(mapping, controllers)
    resource :session, only: [], controller: controllers[:sessions], path: "" do
      get :new, path: mapping.path_names[:sign_in], as: "new"
      post :create, path: mapping.path_names[:sign_in]
      match :destroy, path: mapping.path_names[:sign_out], as: "destroy", via: mapping.sign_out_via
    end
  end

  def devise_password(mapping, controllers)
    resource :password,
             only: [ :new, :create, :edit, :update ],
             path: mapping.path_names[:password],
             controller: controllers[:passwords]
  end

  def devise_confirmation(mapping, controllers)
    resource :confirmation,
             only: [ :new, :create, :show ],
             path: mapping.path_names[:confirmation],
             controller: controllers[:confirmations]
  end

  def devise_unlock(mapping, controllers)
    return unless mapping.to.unlock_strategy_enabled?(:email)

    resource :unlock,
             only: [ :new, :create, :show ],
             path: mapping.path_names[:unlock],
             controller: controllers[:unlocks]
  end

  def devise_registration(mapping, controllers)
    resource :registration,
             only: [ :new, :create, :edit, :update, :destroy ],
             path: mapping.path_names[:registration],
             path_names: {
               new: mapping.path_names[:sign_up],
               edit: mapping.path_names[:edit],
               cancel: mapping.path_names[:cancel]
             },
             controller: controllers[:registrations] do
      get :cancel
    end
  end
end

ActionDispatch::Routing::Mapper.prepend(DeviseRouteKeywords)
