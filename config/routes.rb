# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # concern :api do
  #   resources :posts, only: [:index]
  # end

  # resources :posts, only: [:index]

  namespace :api do
    namespace :v1 do
      constraints(lambda { |req| req.format == :json }) do
        resources :categories, only: [:index, :create]
        resources :posts, only: [:index, :create, :show, :update], param: :slug
        resources :users, only: %i[index create]
        resources :organizations, only: [:index]
        resource :session, only: %i[create destroy]
      end
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all

end
