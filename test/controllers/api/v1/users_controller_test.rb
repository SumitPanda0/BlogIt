# frozen_string_literal: true

# test/controllers/users_controller_test.rb
require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
  end

  def test_should_create_user_with_valid_credentials
    assert_difference "User.count", 1 do
      post api_v1_users_path,
        params: {
          user: {
            name: "Test User",
            email: "test@example.com",
            password: "password",
            password_confirmation: "password",
            organization_id: @organization.id
          }
        },
        as: :json
    end

    assert_response :success

    new_user = User.last
    assert_equal "Test User", new_user.name
    assert_equal "test@example.com", new_user.email
    assert_equal @organization.id, new_user.organization_id
  end

  def test_should_not_create_user_with_invalid_email
    assert_no_difference "User.count" do
      post api_v1_users_path,
        params: {
          user: {
            name: "Test User",
            email: "invalid-email",
            password: "password",
            password_confirmation: "password",
            organization_id: @organization.id
          }
        },
        as: :json
    end

    assert_response :unprocessable_entity
  end

  def test_should_not_create_user_with_mismatched_passwords
    assert_no_difference "User.count" do
      post api_v1_users_path,
        params: {
          user: {
            name: "Test User",
            email: "test@example.com",
            password: "password",
            password_confirmation: "different_password",
            organization_id: @organization.id
          }
        },
        as: :json
    end

    assert_response :unprocessable_entity
    response_json = response.parsed_body
    assert_includes response_json["error"], "Password confirmation doesn't match Password"
  end

  def test_should_not_create_user_with_duplicate_email
    existing_user = create(:user)

    assert_no_difference "User.count" do
      post api_v1_users_path,
        params: {
          user: {
            name: "Test User",
            email: existing_user.email,
            password: "password",
            password_confirmation: "password",
            organization_id: @organization.id
          }
        },
        as: :json
    end

    assert_response :unprocessable_entity
    response_json = response.parsed_body
    assert_includes response_json["error"], "Email has already been taken"
  end
end
