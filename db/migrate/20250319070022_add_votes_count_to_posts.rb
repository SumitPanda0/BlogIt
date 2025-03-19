# frozen_string_literal: true

class AddVotesCountToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :votes_count, :integer
  end
end
