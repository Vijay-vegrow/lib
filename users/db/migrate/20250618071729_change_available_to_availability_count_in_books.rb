class ChangeAvailableToAvailabilityCountInBooks < ActiveRecord::Migration[8.0]
  def change
    remove_column :books, :available, :boolean
    add_column :books, :availability_count, :integer, default: 1, null: false
  end
end
