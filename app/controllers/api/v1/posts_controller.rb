# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  def index
    @posts = Post.includes(:categories, :user)

    if params[:category_ids].present?
      category_ids = params[:category_ids].split(",")
      post_ids = Post.joins(:categories).where(categories: { id: category_ids }).distinct.pluck(:id)
      @posts = @posts.where(id: post_ids)
    end
  end

  def create
    post = Post.new(post_params)
    post.user = current_user if defined?(current_user) && current_user
    post.organization = current_user.organization if defined?(current_user) && current_user

    if !defined?(current_user) || current_user.nil?
      first_user = User.first
      if first_user
        post.user = first_user
        post.organization = first_user.organization
      end
    end

    post.save!

    if params[:post][:category_ids].present?
      post.category_ids = params[:post][:category_ids]
    end

    render_notice("Post was successfully created")
  end

  def show
    @post = Post.includes(:user, :categories).find_by!(slug: params[:slug])
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, category_ids: [])
    end
end
