# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :current_user
  include ApiResponders
  include ApiExceptions
  include Authenticable
  include Pundit::Authorization

  private

    def current_user
      @current_user
    end
end
