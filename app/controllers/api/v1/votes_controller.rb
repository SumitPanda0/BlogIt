# frozen_string_literal: true

class Api::V1::VotesController < ApplicationController
  before_action :authenticate_user_using_x_auth_token
  before_action :load_post!

  def vote
    vote = current_user.votes.find_or_initialize_by(post: @post)

    if vote.persisted? && vote.vote_type.to_s == params[:vote_type]
      vote.destroy
    else
      vote.vote_type = params[:vote_type]
      vote.save
    end

    @post.reload

    render "api/v1/posts/show"
  end

  private

    def load_post!
      @post = Post.find_by!(slug: params[:post_slug] || params[:slug])
    end
end
