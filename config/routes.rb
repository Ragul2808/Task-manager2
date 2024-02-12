Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tasks do
        resources :comments
        post 'add_comment', on: :member
      end
    end
  end
end
