# frozen_string_literal: true

class PostPolicy
  attr_reader :user, :post

  def initialize(user, post)
    @user = user
    @post = post
  end

  # Only allow access if the post belongs to the user's organization
  # and is either created by the user or is published
  def show?
    post.organization_id == user.organization_id &&
      (post.user_id == user.id || post.published?)
  end

  # Only the creator can edit their posts
  def update?
    post.user_id == user.id
  end

  # All authenticated users can create a post
  def create?
    true
  end

  # Policy Scope for index action
  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      # Return posts that belong to the user's organization
      # and are either created by the user or are published
      scope.where(organization_id: user.organization_id)
        .where("user_id = ? OR status = ?", user.id, "published")
    end
  end
end
