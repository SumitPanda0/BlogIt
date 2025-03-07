# frozen_string_literal: true

class Api::V1::OrganizationsController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: :index

  def index
    @organizations = Organization.all.order(:name)
  end
end
