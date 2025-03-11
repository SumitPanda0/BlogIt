# frozen_string_literal: true

json.post do
  json.extract! @post, :id, :title, :description, :slug, :status, :created_at, :updated_at

  json.user do
    json.extract! @post.user, :id, :name
  end

  json.categories do
    json.array! @post.categories do |category|
      json.extract! category, :id, :name
    end
  end
end
