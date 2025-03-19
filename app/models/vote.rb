# frozen_string_literal: true

class Vote < ApplicationRecord
  enum :vote_type, { upvote: "upvote", downvote: "downvote" }

  belongs_to :user
  belongs_to :post, counter_cache: :votes_count

  validates :user_id, uniqueness: { scope: :post_id }
  validates :vote_type, presence: true

  after_save :update_post_vote_counts
  after_destroy :update_post_vote_counts

  private

    def update_post_vote_counts
      post.update_columns(
        upvotes: post.votes.where(vote_type: "upvote").count,
        downvotes: post.votes.where(vote_type: "downvote").count
      )
    end
end
