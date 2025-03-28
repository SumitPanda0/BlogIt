# frozen_string_literal: true

class Api::V1::CategoriesController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: :index

  def index
    @categories = if params[:search].present?
      Category.where("name #{Constants::LIKE_OPERATOR} ?", "%#{params[:search]}%").order(:name)
    else
      Category.all.order(:name)
    end
  end

  def create
    @category = Category.new(category_params)

    if @category.save
      @notice = t("successfully_created", entity: "Category")
      render :create, status: :ok
    else
      render status: :unprocessable_entity, json: {
        error: @category.errors.full_messages.to_sentence
      }
    end
  end

  private

    def category_params
      params.require(:category).permit(:name)
    end
end
