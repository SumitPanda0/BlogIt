# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  before_action :load_post!, only: [:show, :update]
  def index
    @posts = Post.includes(:categories, :user)
      .where(organization_id: current_user.organization_id)

    if params[:category_ids].present?
      category_ids = params[:category_ids].split(",")
      post_ids = Post.joins(:categories).where(categories: { id: category_ids }).distinct.pluck(:id)
      @posts = @posts.where(id: post_ids)
    end
  end

  def create
    post = Post.new(post_params)
    post.user = current_user
    post.organization = current_user.organization
    post.save!

    if params[:post][:category_ids].present?
      post.category_ids = params[:post][:category_ids]
    end

    render_notice("Post was successfully created")
  end

  def show
  end

  def update
    @post.update!(post_params)
    render_notice("Post was successfully updated")
  end

  private

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end

    def post_params
      params.require(:post).permit(:title, :description, category_ids: [])
    end
end
