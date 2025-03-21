# frozen_string_literal: true

class User < ApplicationRecord
  MAX_NAME_LENGTH = 255
  MAX_EMAIL_LENGTH = 255
  MIN_PASSWORD_LENGTH = 6
  belongs_to :organization
  has_many :posts, dependent: :destroy
  has_many :votes, dependent: :destroy
  has_many :voted_posts, through: :votes, source: :post

  has_one_attached :report

  has_secure_password
  has_secure_token :authentication_token

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :email, presence: true, uniqueness: true,
    format: { with: URI::MailTo::EMAIL_REGEXP },
    length: { maximum: MAX_EMAIL_LENGTH }
  validates :password, presence: true, length: { minimum: MIN_PASSWORD_LENGTH },
    if: :password_required?
  validates :password_confirmation, presence: true, if: :password_present?

  before_save :downcase_email

  private

    def password_required?
      return false if password.nil? && !password_digest.blank?

      password_digest.blank? || password.present?
    end

    def password_present?
      password.present?
    end

    def downcase_email
      self.email = email.downcase if email.present?
    end
end
