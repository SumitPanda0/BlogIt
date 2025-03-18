# frozen_string_literal: true

module Posts
  class BulkDestroyService
    attr_reader :post_ids, :current_user

    def initialize(post_ids, current_user)
      @post_ids = post_ids
      @current_user = current_user
    end

    def process
      return false unless post_ids.present?

      # Only allow deletion of the user's own posts
      posts_to_delete = Post.where(id: post_ids, user_id: current_user.id)
      posts_to_delete.destroy_all
      true
    end
  end
end
