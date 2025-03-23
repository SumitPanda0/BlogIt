# frozen_string_literal: true

class SetPublishedAtForExistingPosts < ActiveRecord::Migration[7.1]
  def change
    def up
      Post.where(status: "published").find_each do |post|
        post.update_columns(published_at: post.updated_at)
      end
    end

    def down
      Post.update_all(published_at: nil, last_published_at: nil)
    end
  end
end
