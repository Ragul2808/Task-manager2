class Api::V1::TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy]

  def index
    @tasks = Task.all
    render json: @tasks
  end

  def show
    render json: @task
  end

  def create
    @task = Task.new(task_params)

    if @task.save
      render json: @task, status: :created
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def update
    if @task.update(task_params)
      render json: @task
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end
  
  def destroy
    if @task.destroy
      head :no_content
    else
      render json: { error: 'Failed to delete task' }, status: :unprocessable_entity
    end
  end

  private

  def set_task
    @task = Task.find_by(id: params[:id])

    unless @task
      Rails.logger.error("Task not found with ID: #{params[:id]}")
      render json: { error: 'Task not found' }, status: :not_found
    end
  end

  def task_params
    params.require(:task).permit(:title, :description, :completed)
  end
end