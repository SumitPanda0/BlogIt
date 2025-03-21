# frozen_string_literal: true

class Api::V1::Posts::ReportsController < ApplicationController
  before_action :load_post!

  def create
    job_id = ReportsJob.perform_async(current_user.id, @post.id)
    puts "job_id: #{job_id}"
    render_notice(t("in_progress", action: "Report generation"))
  end

  def download
    puts "download"
    unless @post.report.attached?
      puts "report not attached"
      render_error(t("not_found", entity: "report"), :not_found) and return
    end

    send_data @post.report.download, filename: pdf_file_name, content_type: "application/pdf"
  end

  private

    def pdf_file_name
      "blogit_post_#{@post.slug}.pdf"
    end

    def load_post!
      @post = Post.find_by(id: params[:postId])
      unless @post
        render_error(t("not_found", entity: "post"), :not_found) and return
      end
    end
end
