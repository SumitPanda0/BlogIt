# frozen_string_literal: true

class LoggerMessageBuilderService
  attr_reader :post

  def initialize(post)
    @post = post
  end

  def process!
    build_message
  end

  private

    def build_message
      "A post titled '#{post.title}' was created by #{post.user.name}. #{post_details}"
    end

    def post_details
      "Post ID: #{post.id}, Title: #{post.title}, Description: #{post.description}, Status: #{post.status}, Created at: #{post.created_at}, Updated at: #{post.updated_at}"
    end
end
