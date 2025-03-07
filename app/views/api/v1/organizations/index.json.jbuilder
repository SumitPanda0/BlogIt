# frozen_string_literal: true

json.organizations do
  json.array! @organizations do |organization|
    json.extract! organization, :id, :name
  end
end
