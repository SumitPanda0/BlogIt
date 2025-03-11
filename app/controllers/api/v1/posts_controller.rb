# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  before_action :load_post!, only: [:show, :update, :destroy]
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index

  def index
    @posts = policy_scope(Post).includes(:categories, :user)
      .where(organization_id: current_user.organization_id)
    @draft_posts = @posts.where(status: :draft)
    @published_posts = @posts.where(status: :published)
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
    authorize post
    post.save!

    if params[:post][:category_ids].present?
      post.category_ids = params[:post][:category_ids]
    end

    render_notice("Post was successfully created")
  end

  def show
    authorize @post
  end

  def update
    authorize @post
    @post.update!(post_params)
    render_notice("Post was successfully updated") unless params.key?(:quiet)
  end

  def destroy
    authorize @post
    @post.destroy!
    render_notice("Post was successfully deleted") unless params.key?(:quiet)
  end

  private

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end

    def post_params
      params.require(:post).permit(:title, :description, :status, category_ids: [])
    end
end
