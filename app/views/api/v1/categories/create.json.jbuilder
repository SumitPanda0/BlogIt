# frozen_string_literal: true

json.notice @notice
json.category do
  json.partial! "api/v1/categories/category", category: @category
end
