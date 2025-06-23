class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :role, presence: true, inclusion: { in: %w[admin librarian member] }
  validates :status, inclusion: { in: %w[pending approved rejected], allow_nil: true }
  has_many :borrowings, dependent: :destroy
  def can_login?
    return true if role != 'librarian'
    status == 'approved'
  end
end
