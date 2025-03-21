# frozen_string_literal: true

class PostLoggerJob
  include Sidekiq::Job

  def perform(post_id)
    Sidekiq.logger.info("Starting PostLoggerJob for post_id: #{post_id}")
    post = Post.find(post_id)
    message = "Created post #{post.id} with title #{post.title}"
    log = Log.create!(post_id: post.id, message:)
    puts log.message
  end
end
