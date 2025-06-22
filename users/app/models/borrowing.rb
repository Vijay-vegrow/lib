# app/models/borrowing.rb
class Borrowing < ApplicationRecord
  belongs_to :user
  belongs_to :book
  belongs_to :approved_by, class_name: 'User', optional: true

  validates :borrowed_at, presence: true

  STATUSES = %w[borrowed return_requested returned]

end