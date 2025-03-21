# frozen_string_literal: true

require "test_helper"

class LoggerMessageBuilderServiceTest < ActiveSupport::TestCase
  def setup
    @user = create(:user)
    @post = create(:post, user: @user)
    @service = LoggerMessageBuilderService.new(@post)
  end

  def test_process_returns_formatted_message
    message = @service.process!

    assert_includes message, "A post titled '#{@post.title}'"
    assert_includes message, "was created by #{@post.user.name}"
    assert_includes message, "Post ID: #{@post.id}"
    assert_includes message, "Title: #{@post.title}"
    assert_includes message, "Description: #{@post.description}"
    assert_includes message, "Status: #{@post.status}"
    assert_includes message, "Created at: #{@post.created_at}"
    assert_includes message, "Updated at: #{@post.updated_at}"
  end

  def test_build_message_includes_post_details
    message = @service.send(:build_message)
    post_details = @service.send(:post_details)

    assert_includes message, post_details
  end

  def test_post_details_contains_all_required_information
    details = @service.send(:post_details)

    assert_includes details, "Post ID: #{@post.id}"
    assert_includes details, "Title: #{@post.title}"
    assert_includes details, "Description: #{@post.description}"
    assert_includes details, "Status: #{@post.status}"
    assert_includes details, "Created at: #{@post.created_at}"
    assert_includes details, "Updated at: #{@post.updated_at}"
  end
end
