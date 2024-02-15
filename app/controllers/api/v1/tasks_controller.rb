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
    @task = Task.find_by(id: params[:id])
  
    if @task
      @task.destroy
      render json: { message: 'Task successfully destroyed' }, status: :ok
    else
      render json: { error: "Task with ID #{params[:id]} not found" }, status: :not_found
    end
  end
  

  private

  def set_task
    task_id = params[:id]
    Rails.logger.info("Fetching task with ID: #{task_id}")
    @task = Task.find(task_id)
  rescue ActiveRecord::RecordNotFound
    Rails.logger.error("Task not found with ID: #{task_id}")
    # Handle the case where the task doesn't exist
  end
  

  def task_params
    params.require(:task).permit(:title, :description, :completed)
  end
end