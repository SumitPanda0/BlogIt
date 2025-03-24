# frozen_string_literal: true

require "test_helper"

class VoteTest < ActiveSupport::TestCase
  def setup
    @user = create(:user)
    @post = create(:post)
    @vote = build(:vote, user: @user, post: @post)
  end

  test "should be valid with valid attributes" do
    assert @vote.valid?
  end

  test "should belong to a user" do
    @vote.user = nil
    assert_not @vote.valid?
  end

  test "should belong to a post" do
    @vote.post = nil
    assert_not @vote.valid?
  end

  test "should have a vote type" do
    @vote.vote_type = nil
    assert_not @vote.valid?
  end

  test "should only allow upvote or downvote as vote types" do
    @vote.vote_type = "upvote"
    assert @vote.valid?

    @vote.vote_type = "downvote"
    assert @vote.valid?

    assert_raises(ArgumentError) do
      @vote.vote_type = "invalid_type"
    end
  end

  test "should enforce uniqueness of user_id scoped to post_id" do
    @vote.save
    duplicate_vote = build(:vote, user: @user, post: @post)
    assert_not duplicate_vote.valid?
    assert_includes duplicate_vote.errors[:user_id], "has already been taken"
  end

  test "should update post upvotes count when upvote is saved" do
    vote = build(:vote, :upvote, user: @user, post: @post)
    initial_upvotes = @post.upvotes

    vote.save
    @post.reload

    assert_equal initial_upvotes + 1, @post.upvotes
  end

  test "should update post downvotes count when downvote is saved" do
    vote = build(:vote, :downvote, user: @user, post: @post)
    initial_downvotes = @post.downvotes

    vote.save
    @post.reload

    assert_equal initial_downvotes + 1, @post.downvotes
  end

  test "should decrease post upvotes count when upvote is destroyed" do
    vote = create(:vote, :upvote, user: @user, post: @post)
    @post.reload
    initial_upvotes = @post.upvotes

    vote.destroy
    @post.reload

    assert_equal initial_upvotes - 1, @post.upvotes
  end

  test "should decrease post downvotes count when downvote is destroyed" do
    vote = create(:vote, :downvote, user: @user, post: @post)
    @post.reload
    initial_downvotes = @post.downvotes

    vote.destroy
    @post.reload

    assert_equal initial_downvotes - 1, @post.downvotes
  end

  test "should make post bloggable when net votes meet threshold" do
    @post.update_columns(upvotes: 0, downvotes: 0, is_bloggable: false)
    threshold = Constants::DEFAULT_BLOGGABLE_THRESHOLD

    threshold.times do
      user = create(:user)
      create(:vote, :upvote, user: user, post: @post)
    end

    @post.reload
    assert @post.is_bloggable, "Post should be bloggable when net votes meet threshold"
  end

  test "should make post non-bloggable when net votes fall below threshold" do
    threshold = Constants::DEFAULT_BLOGGABLE_THRESHOLD

    @post.update_columns(upvotes: threshold, downvotes: 0, is_bloggable: true)

    threshold.times do
      user = create(:user)
      create(:vote, :downvote, user: user, post: @post)
    end

    @post.reload
    assert_not @post.is_bloggable, "Post should not be bloggable when net votes fall below threshold"
  end

  test "should toggle vote type when user changes their vote" do
    vote = create(:vote, :upvote, user: @user, post: @post)
    assert_equal "upvote", vote.vote_type

    vote.update(vote_type: "downvote")

    @post.reload
    assert_equal "downvote", vote.reload.vote_type
    assert_equal 0, @post.upvotes
    assert_equal 1, @post.downvotes
  end

  test "should handle multiple votes from different users" do
    5.times do
      create(:vote, :upvote, user: create(:user), post: @post)
    end

    3.times do
      create(:vote, :downvote, user: create(:user), post: @post)
    end

    @post.reload
    assert_equal 5, @post.upvotes
    assert_equal 3, @post.downvotes

    net_votes = @post.upvotes - @post.downvotes
    threshold = Constants::DEFAULT_BLOGGABLE_THRESHOLD

    if net_votes >= threshold
      assert @post.is_bloggable
    else
      assert_not @post.is_bloggable
    end
  end
end
