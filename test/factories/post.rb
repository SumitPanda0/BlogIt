# frozen_string_literal: true

FactoryBot.define do
  factory :post do
    title { Faker::Lorem.sentence(word_count: 3) }
    description { Faker::Lorem.paragraph(sentence_count: 5) }
    upvotes { 0 }
    downvotes { 0 }
    is_bloggable { [true, false].sample }
    association :user
    association :organization
    status { :draft }

    after(:build) do |post|
      post.categories << build(:category) if post.categories.empty?
    end
  end
end
