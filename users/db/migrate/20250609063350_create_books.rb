class CreateBooks < ActiveRecord::Migration[8.0]
  def change
    create_table :books do |t|
      t.string :title
      t.string :author
      t.integer :publication_year
      t.string :publisher
      t.string :image_url
      t.boolean :available, default: true
      t.timestamps
    end
  end
end
