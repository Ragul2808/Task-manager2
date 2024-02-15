# db/migrate/[timestamp]_add_content_to_comments.rb

class AddContentToComments < ActiveRecord::Migration[7.1]
  def change
    add_column :comments, :content, :text
  end
end
