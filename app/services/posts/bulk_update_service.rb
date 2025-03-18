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

      # If changing to published, only update posts that are not already published
      # to avoid updating the last published date unnecessarily
      if status == "published"
        posts_to_update = posts_to_update.where.not(status: "published")
      end

      # Return true even if no posts were updated
      posts_to_update.update_all(status: status)
      true
    end
  end
end
