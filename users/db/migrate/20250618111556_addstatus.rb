class Addstatus < ActiveRecord::Migration[8.0]
  def change
    add_column :borrowings, :status, :string, default: 'borrowed', null: false
  end
end
