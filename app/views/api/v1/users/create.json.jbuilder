# frozen_string_literal: true

json.notice t("successfully_created", entity: "User")
json.user do
  json.extract! @user, :id, :name, :email, :authentication_token
end
