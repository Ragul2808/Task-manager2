# app/models/task.rb
class Task < ApplicationRecord
    has_many :comments, dependent: :destroy
  end
  
  # app/models/comment.rb
  class Comment < ApplicationRecord
    belongs_to :task
    belongs_to :parent_comment, class_name: 'Comment', optional: true
    has_many :replies, class_name: 'Comment', foreign_key: 'parent_comment_id', dependent: :destroy
  
    # Validation to prevent circular references (optional)
    validate :no_circular_references
  
    private
  
    def no_circular_references
      ancestor_ids = [self.id]
      current_comment = self
  
      while current_comment.parent_comment
        if ancestor_ids.include?(current_comment.parent_comment_id)
          errors.add(:parent_comment_id, 'Circular reference detected')
          break
        else
          ancestor_ids << current_comment.parent_comment_id
          current_comment = current_comment.parent_comment
        end
      end
    end
  end
  