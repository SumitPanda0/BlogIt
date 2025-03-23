# frozen_string_literal: true

module Posts
  class BulkUpdateService
    attr_reader :post_ids, :status, :current_user

    def initialize(post_ids, status, current_user)
      @post_ids = post_ids
      @status = status
      @current_user = current_user
    end

    def process
      return false unless post_ids.present? && status.present?

      posts_to_update = Post.where(id: post_ids, user_id: current_user.id)

      if status == "published"
        # Only select posts that aren't already published
        draft_posts = posts_to_update.where(status: "draft")

        # For draft posts, we need to update with callbacks to manage timestamps
        # Using update_all would skip callbacks
        draft_posts.find_each do |post|
          post.update(status: "published")
        end

        # Return true if at least one post was updated
        draft_posts.any?
      else
        # For drafts, update with callbacks as well
        posts_published = posts_to_update.where(status: "published")
        posts_published.find_each do |post|
          post.update(status: "draft")
        end

        posts_published.any?
      end
    end
  end
end
