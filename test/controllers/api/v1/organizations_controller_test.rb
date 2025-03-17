# frozen_string_literal: true

require "test_helper"

class Api::V1::OrganizationsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @headers = headers(@user)
  end

  def test_should_list_all_organizations
    get api_v1_organizations_path, headers: @headers
    assert_response :success

    response_json = response.parsed_body
    expected_organization_ids = Organization.all.pluck(:id).sort
    actual_organization_ids = response_json["organizations"].pluck("id").sort

    assert_equal expected_organization_ids, actual_organization_ids
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
