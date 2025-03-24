# frozen_string_literal: true

require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  def setup
    @category = build(:category)
  end

  def test_category_should_be_valid
    assert @category.valid?
  end

  def test_category_should_not_be_valid_without_name
    @category.name = ""
    assert_not @category.valid?
    assert_includes @category.errors.full_messages, "Name can't be blank"
  end

  def test_category_name_should_be_unique
    @category.save!
    duplicate_category = build(:category, name: @category.name)
    assert_not duplicate_category.valid?
    assert_includes duplicate_category.errors.full_messages, "Name has already been taken"
  end

  def test_category_should_have_and_belong_to_many_posts
    assert_respond_to @category, :posts
  end

  def test_category_can_have_multiple_posts
    @category.save!
    post1 = create(:post)
    post2 = create(:post)

    @category.posts << post1
    @category.posts << post2

    assert_equal 2, @category.posts.count
  end
end
