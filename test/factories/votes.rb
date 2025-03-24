# frozen_string_literal: true

FactoryBot.define do
  factory :vote do
    association :user
    association :post
    vote_type { %w[upvote downvote].sample }

    trait :upvote do
      vote_type { "upvote" }
    end

    trait :downvote do
      vote_type { "downvote" }
    end
  end
end
