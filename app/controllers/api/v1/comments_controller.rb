# app/controllers/api/v1/comments_controller.rb
module Api
  module V1
    class CommentsController < ApplicationController
      before_action :set_task
      before_action :set_comment, only: [:show, :update, :destroy]

      def index
        @comments = @task.comments
        render json: @comments
      end

      def show
        render json: @comment
      end

      def create
        @comment = @task.comments.build(comment_params)

        if @comment.save
          render json: @comment, status: :created
        else
          render json: @comment.errors, status: :unprocessable_entity
        end
      end


      def update
        if @comment.update(comment_params)
          render json: @comment
        else
          render json: @comment.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @comment.destroy
        head :no_content
      end

      private
     
      def set_task
        @task = Task.find(params[:task_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Task not found" }, status: :not_found
      end
      
      
      def set_comment
        @comment = @task.comments.find(params[:id])
      end

      def comment_params
        params.require(:comment).permit(:text, :task_id, :parent_comment_id)
      end
      
    end
  end
end