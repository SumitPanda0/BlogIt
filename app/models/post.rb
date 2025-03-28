# frozen_string_literal: true

class Post < ApplicationRecord
  scope :accessible_to, ->(user_id) { where(user_id: user_id) }

  MAX_TITLE_LENGTH = 125
  MAX_DESCRIPTION_LENGTH = 10000

  attribute :status, :string, default: "draft"
  enum :status, { draft: "draft", published: "published" }, default: :draft

  belongs_to :user
  belongs_to :organization
  has_and_belongs_to_many :categories
  has_many :votes, dependent: :destroy
  has_many :voters, through: :votes, source: :user

  has_one_attached :report

  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }
  validates :description, presence: true, length: { maximum: MAX_DESCRIPTION_LENGTH }
  validates :upvotes, presence: true, numericality: true
  validates :downvotes, presence: true, numericality: true
  validates_inclusion_of :is_bloggable, in: [true, false]
  validates :slug, uniqueness: true
  validate :slug_not_changed

  before_create :set_slug
  after_create :log_post_details
  before_save :manage_publish_timestamps, if: -> { status_changed? }

  private

    def set_slug
      title_slug = title.parameterize
      regex_pattern = "slug #{Constants::DB_REGEX_OPERATOR} ?"
      latest_post_slug = Post.where(
        regex_pattern,
        "^#{title_slug}$|^#{title_slug}-[0-9]+$"
      ).order("LENGTH(slug) DESC", slug: :desc).first&.slug
      slug_count = 0
      if latest_post_slug.present?
        slug_count = latest_post_slug.split("-").last.to_i
        only_one_slug_exists = slug_count == 0
        slug_count = 1 if only_one_slug_exists
      end
      slug_candidate = slug_count.positive? ? "#{title_slug}-#{slug_count + 1}" : title_slug
      self.slug = slug_candidate
    end

    def slug_not_changed
      if will_save_change_to_slug? && self.persisted?
        errors.add(:slug, I18n.t("post.slug.immutable"))
      end
    end

    def log_post_details
      PostLoggerJob.perform_async(self.id)
    end

    def manage_publish_timestamps
      if status == "published" && status_was == "draft"
        self.last_published_at = published_at if published_at.present?
        self.published_at = Time.current
      elsif status == "draft" && status_was == "published"
        self.last_published_at = published_at
      end
    end
end
