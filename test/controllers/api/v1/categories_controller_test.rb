# frozen_string_literal: true

# test/controllers/categories_controller_test.rb
require "test_helper"

class Api::V1::CategoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @category = create(:category)
    @headers = headers(@user)
  end

  def test_should_list_all_categories
    get api_v1_categories_path, headers: @headers
    assert_response :success

    response_json = response.parsed_body
    expected_category_ids = Category.all.pluck(:id).sort
    actual_category_ids = response_json["categories"].pluck("id").sort

    assert_equal expected_category_ids, actual_category_ids
  end

  def test_should_filter_categories_by_search_term
    category_name = "Ruby Programming"
    create(:category, name: category_name)

    get api_v1_categories_path, params: { search: "Ruby" }, headers: @headers
    assert_response :success

    response_json = response.parsed_body

    category_names = response_json["categories"].pluck("name")

    assert_includes category_names, category_name
    assert_not_includes category_names, @category.name
  end

  def test_should_create_valid_category
    category_name = "New Category"

    assert_difference "Category.count", 1 do
      post api_v1_categories_path,
        params: { category: { name: category_name } },
        headers: @headers
    end

    assert_response :success
    response_json = response.parsed_body
    assert_equal "Category was successfully created", response_json["notice"]

    new_category = Category.last
    assert_equal category_name, new_category.name
  end

  def test_should_not_create_category_without_name
    assert_no_difference "Category.count" do
      post api_v1_categories_path,
        params: { category: { name: "" } },
        headers: @headers
    end

    assert_response :unprocessable_entity
    response_json = response.parsed_body
    assert_includes response_json["error"], "Name can't be blank"
  end

  def test_should_not_create_duplicate_category
    assert_no_difference "Category.count" do
      post api_v1_categories_path,
        params: { category: { name: @category.name } },
        headers: @headers
    end

    assert_response :unprocessable_entity
    response_json = response.parsed_body
    assert_includes response_json["error"], "Name has already been taken"
  end
end
