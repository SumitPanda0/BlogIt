# frozen_string_literal: true

json.posts do
  json.array! @posts do |post|
    json.partial! "api/v1/posts/post", post: post
  end
end
