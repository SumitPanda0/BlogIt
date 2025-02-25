class Post < ApplicationRecord
  MAX_TITLE_LENGTH = 125
  MAX_DESCRIPTION_LENGTH = 10000
  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }
  validates :description, presence: true, length: { maximum: MAX_DESCRIPTION_LENGTH }
  validates :upvotes, presence: true, numericality: true
  validates :downvotes, presence: true, numericality: true
  validates :is_bloggable, presence: true, inclusion: { in: [true, false] }
end
