# app/models/book.rb
class Book < ApplicationRecord
  validates :title, :author, :publication_year, :publisher, :image_url, presence: true
  validates :available, inclusion: { in: [true, false] }
  has_many :borrowings
end