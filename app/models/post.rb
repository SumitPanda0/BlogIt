class Post < ApplicationRecord
  validates :title, presence: true
  validates :description, presence: true
  validates :upvotes, presence: true, numericality: true
  validates :downvotes, presence: true, numericality: true
  validates :is_bloggable, presence: true, inclusion: { in: [true, false] }
end
