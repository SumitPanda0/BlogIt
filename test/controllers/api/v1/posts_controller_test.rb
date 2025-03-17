# frozen_string_literal: true

# test/controllers/posts_controller_test.rb
require "test_helper"

class Api::V1::PostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @another_user = create(:user, organization: @organization)
    @post = create(:post, user: @user, organization: @organization)
    @category = create(:category)
    @headers = headers(@user)
    @another_user_headers = headers(@another_user)
  end

  def test_should_list_all_posts_for_valid_user
    get api_v1_posts_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body

    assert_not_nil response_json["posts"], "Response should contain 'posts' key"

    expected_draft_post_ids = Post.where(organization_id: @user.organization_id, status: :draft).pluck(:id).sort
    expected_published_post_ids = Post.where(organization_id: @user.organization_id, status: :published).pluck(:id).sort

    all_posts = response_json["posts"]
    actual_draft_post_ids = all_posts.select { |post| post["status"] == "draft" }.map { |post| post["id"] }.sort
    actual_published_post_ids = all_posts.select { |post| post["status"] == "published" }.map { |post| post["id"] }.sort

    assert_equal expected_draft_post_ids, actual_draft_post_ids
    assert_equal expected_published_post_ids, actual_published_post_ids
  end

  def test_should_filter_posts_by_category
    @post.categories << @category

    get api_v1_posts_path, params: { category_ids: @category.id }, headers: @headers
    assert_response :success
    response_json = response.parsed_body

    all_posts = response_json["posts"]
    assert_not_nil all_posts, "Response should contain 'posts' key"

    post_ids = all_posts.map { |post| post["id"] }

    assert_includes post_ids, @post.id
  end

  def test_should_create_valid_post
    assert_difference "Post.count", 1 do
      post api_v1_posts_path,
        params: {
          post: {
            title: "Test Post",
            description: "Test Description",
            status: "draft",
            category_ids: [@category.id]
          }
        }.to_json,
        headers: @headers
    end

    assert_response :success
    response_json = response.parsed_body
    assert_equal "Post was successfully created", response_json["notice"]

    new_post = Post.last
    assert_equal @user.id, new_post.user_id
    assert_equal @organization.id, new_post.organization_id
    assert_equal [@category.id], new_post.category_ids
  end

  def test_should_not_create_post_without_title
    assert_no_difference "Post.count" do
      post api_v1_posts_path,
        params: { post: { title: "", description: "Test Description", status: "draft" } }.to_json,
        headers: @headers.merge({ "Content-Type" => "application/json" })
    end

    assert_response :unprocessable_entity
  end

  def test_should_show_post
    get api_v1_post_path(@post.slug), headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal @post.id, response_json["post"]["id"]
  end

  def test_should_update_post
    new_title = "Updated Post Title"

    put api_v1_post_path(@post.slug),
      params: { post: { title: new_title } }.to_json,
      headers: @headers.merge({ "Content-Type" => "application/json" })

    assert_response :success
    response_json = response.parsed_body
    assert_equal "Post was successfully updated", response_json["notice"]

    @post.reload
    assert_equal new_title, @post.title
  end

  def test_should_update_post_categories
    new_category = create(:category)

    put api_v1_post_path(@post.slug),
      params: { post: { category_ids: [new_category.id] } }.to_json,
      headers: @headers.merge({ "Content-Type" => "application/json" })

    assert_response :success

    @post.reload
    assert_equal [new_category.id], @post.category_ids
  end

  def test_should_not_update_post_by_unauthorized_user
    new_title = "Unauthorized Update"

    # Create a post by @user and try to update it with @another_user
    put api_v1_post_path(@post.slug),
      params: { post: { title: new_title } }.to_json,
      headers: @another_user_headers.merge({ "Content-Type" => "application/json" })

    assert_response :forbidden

    @post.reload
    assert_not_equal new_title, @post.title
  end

  def test_should_destroy_post
    assert_difference "Post.count", -1 do
      delete api_v1_post_path(@post.slug), headers: @headers
    end

    assert_response :success
    response_json = response.parsed_body
    assert_equal "Post was successfully deleted", response_json["notice"]
  end

  def test_should_not_destroy_post_by_unauthorized_user
    assert_no_difference "Post.count" do
      delete api_v1_post_path(@post.slug), headers: @another_user_headers
    end

    assert_response :forbidden
  end

  def test_should_list_user_posts
    get user_posts_api_v1_posts_path, headers: @headers
    assert_response :success

    response_json = response.parsed_body
    all_posts = response_json["posts"]
    user_post_ids = all_posts.pluck("id")

    assert_includes user_post_ids, @post.id

    # Verify only the current user's posts are returned
    other_user_post = create(:post, user: @another_user, organization: @organization)
    assert_not_includes user_post_ids, other_user_post.id
  end

  def test_should_handle_not_found_post
    get api_v1_post_path("non-existent-slug"), headers: @headers
    assert_response :not_found
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
