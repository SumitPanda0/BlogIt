# frozen_string_literal: true

require "test_helper"

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @organization = build(:organization)
  end

  def test_organization_should_be_valid
    assert @organization.valid?
  end

  def test_organization_should_not_be_valid_without_name
    @organization.name = ""
    assert_not @organization.valid?
    assert_includes @organization.errors.full_messages, "Name can't be blank"
  end

  def test_organization_name_should_be_unique
    @organization.save!
    duplicate_organization = build(:organization, name: @organization.name)
    assert_not duplicate_organization.valid?
    assert_includes duplicate_organization.errors.full_messages, "Name has already been taken"
  end

  def test_organization_should_have_many_users
    assert_respond_to @organization, :users
  end

  def test_organization_should_have_many_posts
    assert_respond_to @organization, :posts
  end

  def test_dependent_destroy_for_users
    @organization.save!
    user = create(:user, organization: @organization)
    assert_difference "User.count", -1 do
      @organization.destroy
    end
  end

  def test_dependent_destroy_for_posts
    @organization.save!
    post = create(:post, organization: @organization)
    assert_difference "Post.count", -1 do
      @organization.destroy
    end
  end

  # test "the truth" do
  #   assert true
  # end
end
