# frozen_string_literal: true

class CreateLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :logs do |t|
      t.integer :post_id
      t.text :message
      t.timestamps
    end
  end
end
