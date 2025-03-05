# frozen_string_literal: true

class User < ApplicationRecord
  belongs_to :organization
  has_many :posts, dependent: :destroy

  has_secure_password

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true,
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 6 }, if: :password_required?
  validates :password_confirmation, presence: true, if: :password_present?

  private

    def password_required?
      password_digest.blank? || password.present?
    end

    def password_present?
      password.present?
    end
end
