# frozen_string_literal: true

require "test_helper"

class Api::V1::SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
  end

  def test_should_login_user_with_valid_credentials
    @user = create(:user)

    post api_v1_session_path,
      params: { login: { email: @user.email, password: "welcome" } },
      as: :json

    assert_response :success
    response_json = response.parsed_body
    assert_equal @user.authentication_token, response_json["authentication_token"]
  end

  def test_should_not_login_user_with_invalid_credentials
    post api_v1_session_path,
      params: { login: { email: @user.email, password: "wrong_password" } },
      as: :json

    assert_response :unauthorized
    response_json = response.parsed_body
    assert_equal I18n.t("session.incorrect_credentials"), response_json["error"]
  end

  def test_should_respond_with_not_found_error_if_user_is_not_present
    non_existent_email = "non_existent_user@example.com"

    post api_v1_session_path,
      params: { login: { email: non_existent_email, password: "password" } },
      as: :json

    assert_response :not_found
  end

  def test_should_logout_user
    delete api_v1_session_path, headers: headers(@user)

    assert_response :success
    response_json = response.parsed_body
    assert_equal I18n.t("session.logged_out_successfully"), response_json["notice"]
  end

  private

    def headers(user)
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Auth-Token": user.authentication_token,
        "X-Auth-Email": user.email
      }
    end
end
