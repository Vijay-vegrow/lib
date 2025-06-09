# app/models/borrowing.rb
class Borrowing < ApplicationRecord
  belongs_to :user
  belongs_to :book

  validates :borrowed_at, presence: true
end