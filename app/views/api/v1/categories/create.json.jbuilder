# frozen_string_literal: true

json.notice @notice
json.category do
  json.extract! @category, :id, :name
end
