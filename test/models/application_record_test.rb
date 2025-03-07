# frozen_string_literal: true

require "test_helper"

class ApplicationRecordTest < ActiveSupport::TestCase
  def test_errors_to_sentence
    user = User.new

    user.validate

    error_sentence = user.errors_to_sentence

    assert_kind_of String, error_sentence

    assert_includes error_sentence, "Name can't be blank"
    assert_includes error_sentence, "Email can't be blank"

    assert error_sentence.include?(" and ") || error_sentence.include?(", ")
  end
end
