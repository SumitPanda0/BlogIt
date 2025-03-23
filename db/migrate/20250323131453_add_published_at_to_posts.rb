# frozen_string_literal: true

class AddPublishedAtToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :published_at, :datetime
    add_column :posts, :last_published_at, :datetime
  end
end
