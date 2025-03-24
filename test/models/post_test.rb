# frozen_string_literal: true

require "test_helper"

class PostTest < ActiveSupport::TestCase
  def setup
    @post = build(:post)
  end

  def test_post_should_be_valid
    assert @post.valid?
  end

  def test_post_should_not_be_valid_without_title
    @post.title = ""
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Title can't be blank"
  end

  def test_post_title_should_not_exceed_max_length
    @post.title = "a" * (Post::MAX_TITLE_LENGTH + 1)
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Title is too long (maximum is #{Post::MAX_TITLE_LENGTH} characters)"
  end

  def test_post_should_not_be_valid_without_description
    @post.description = ""
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Description can't be blank"
  end

  def test_post_description_should_not_exceed_max_length
    @post.description = "a" * (Post::MAX_DESCRIPTION_LENGTH + 1)
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Description is too long (maximum is #{Post::MAX_DESCRIPTION_LENGTH} characters)"
  end

  def test_post_should_not_be_valid_without_upvotes
    @post.upvotes = nil
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Upvotes can't be blank"
  end

  def test_post_should_not_be_valid_without_downvotes
    @post.downvotes = nil
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Downvotes can't be blank"
  end

  def test_post_should_not_be_valid_with_non_numeric_upvotes
    @post.upvotes = "abc"
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Upvotes is not a number"
  end

  def test_post_should_not_be_valid_with_non_numeric_downvotes
    @post.downvotes = "abc"
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Downvotes is not a number"
  end

  def test_post_should_belong_to_user
    assert_respond_to @post, :user
  end

  def test_post_should_belong_to_organization
    assert_respond_to @post, :organization
  end

  def test_post_should_have_and_belong_to_many_categories
    assert_respond_to @post, :categories
  end

  def test_post_slug_should_be_generated_before_create
    @post.save!
    assert_not_nil @post.slug
  end

  def test_post_slug_should_be_parameterized_title
    title = "This is a Test Title"
    @post.title = title
    @post.save!
    assert_equal title.parameterize, @post.slug
  end

  def test_post_slug_should_be_unique
    @post.save!
    duplicate_post = build(:post, title: @post.title)
    duplicate_post.save!
    assert_not_equal @post.slug, duplicate_post.slug
  end

  def test_post_slug_should_not_be_changed_after_create
    @post.save!
    original_slug = @post.slug
    @post.title = "New Title"
    @post.save!
    assert_equal original_slug, @post.reload.slug
  end

  def test_slug_not_changed_validation
    @post.save!
    @post.slug = "new-slug"
    assert_not @post.valid?

    expected_error = I18n.t("post.slug.immutable")
    assert_includes @post.errors.messages[:slug], expected_error
  end

  def test_set_slug_with_existing_slug
    @post.title = "Test Post"
    @post.save!

    second_post = build(:post, title: "Test Post")
    second_post.save!

    assert_equal "test-post-2", second_post.slug

    third_post = build(:post, title: "Test Post")
    third_post.save!

    assert_equal "test-post-3", third_post.slug
  end

  def test_post_can_have_multiple_categories
    @post.save!
    category1 = create(:category)
    category2 = create(:category)

    @post.categories << category1
    @post.categories << category2

    assert_equal 3, @post.categories.count
  end
end
