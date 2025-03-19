# frozen_string_literal: true

FactoryBot.define do
  factory :vote do
    user { nil }
    post { nil }
    vote_type { "MyString" }
  end
end
