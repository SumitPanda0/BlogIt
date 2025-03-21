# frozen_string_literal: true

class Log < ApplicationRecord
  validates :post_id, :message, presence: true
end
