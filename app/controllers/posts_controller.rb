# frozen_string_literal: true

class PostsController < ApplicationController
  def index
    @posts = Post.all
    render json: @posts
  end
end
