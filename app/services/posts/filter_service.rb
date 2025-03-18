# frozen_string_literal: true

module Posts
  class FilterService
    attr_reader :posts, :filter_params

    def initialize(posts, filter_params = {})
      @posts = posts
      @filter_params = filter_params
    end

    def process
      result = @posts

      result = filter_by_title(result) if filter_params[:title].present?
      result = filter_by_category(result) if filter_params[:category].present?
      result = filter_by_status(result) if filter_params[:status].present?

      result
    end

    private

      def filter_by_title(result)
        result.where("LOWER(title) LIKE LOWER(?)", "%#{filter_params[:title]}%")
      end

      def filter_by_category(result)
        return result unless filter_params[:category].present?

        categories = filter_params[:category].split(",")
        result.joins(:categories)
          .where(categories: { name: categories })
          .distinct
      end

      def filter_by_status(result)
        result.where(status: filter_params[:status])
      end
  end
end
