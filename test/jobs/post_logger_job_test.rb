# frozen_string_literal: true

require "test_helper"
require "sidekiq/testing"

class PostLoggerJobTest < ActiveJob::TestCase
  def setup
    @post = create(:post)
  end

  def test_logger_runs_once_after_post_is_created
    Sidekiq::Testing.fake! do
      assert_difference -> { PostLoggerJob.jobs.size }, 1 do
        PostLoggerJob.perform_async(@post.id)
      end
    end
  end

  def test_log_count_increments_on_running_post_logger
    assert_difference "Log.count", 1 do
      PostLoggerJob.new.perform(@post.id)
    end
  end
end
