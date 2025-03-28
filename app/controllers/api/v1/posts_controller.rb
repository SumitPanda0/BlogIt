# frozen_string_literal: true

class Api::V1::PostsController < ApplicationController
  before_action :load_post!, only: [:show, :update, :destroy]
  after_action :verify_authorized, except: [:index, :user_posts, :bulk_update, :bulk_destroy]
  after_action :verify_policy_scoped, only: [:index, :user_posts]

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

    render_notice(t("successfully_created", entity: "Post"))
  end

  def show
    authorize @post
  end

  def update
    authorize @post
    @post.update!(post_params)
    render_notice(t("successfully_updated", entity: "Post")) unless params.key?(:quiet)
  end

  def destroy
    authorize @post
    @post.destroy!
    render_notice(t("successfully_deleted", entity: "Post")) unless params.key?(:quiet)
  end

  def user_posts
    @posts = policy_scope(Post).includes(:categories, :user)
      .where(organization_id: current_user.organization_id)
      .where(user_id: current_user.id)
      .order(created_at: :desc)

    if filter_params.present?
      @posts = Posts::FilterService.new(@posts, filter_params).process
    end

    render :index
  end

  def bulk_update
    result = Posts::BulkUpdateService.new(params[:post_ids], params[:status], current_user).process
    render json: { success: result }, status: :ok
  end

  def bulk_destroy
    result = Posts::BulkDestroyService.new(params[:post_ids], current_user).process
    render json: { success: result }, status: :ok
  end

  private

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end

    def post_params
      params.require(:post).permit(:title, :description, :status, category_ids: [])
    end

    def filter_params
      params.fetch(:filter, {}).permit(:title, :status, :category)
    end
end
