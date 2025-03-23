# frozen_string_literal: true

json.posts do
  json.array! @posts do |post|
    json.extract! post, :id, :title, :description, :slug, :status, :created_at, :updated_at, :votes_count, :upvotes,
      :downvotes, :is_bloggable, :published_at, :last_published_at

    json.display_date post.published_at || post.last_published_at

    json.user do
      json.extract! post.user, :id, :name
    end

    json.categories do
      json.array! post.categories do |category|
        json.extract! category, :id, :name
      end
    end

    if defined?(current_user) && current_user
      user_vote = post.votes.find_by(user: current_user)
      json.current_user_vote user_vote ? user_vote.vote_type : nil
    end
  end
end
