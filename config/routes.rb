# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tasks do
        resources :comments
      end
    end
  end
end
