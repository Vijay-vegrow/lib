# app/models/book.rb
class Book < ApplicationRecord
  validates :title, :author, :publication_year, :publisher, :image_url, presence: true
  validates :availability_count, numericality: { greater_than_or_equal_to: 0 }
  has_many :borrowings
  before_validation :set_default_image_url
  before_destroy :ensure_not_borrowed

  private

  def set_default_image_url
    self.image_url = "https://www.omnibookslibrary.com/app/admin/images/books/1654677967.jpg" if image_url.blank?
  end

  def ensure_not_borrowed
    if borrowings.where(status: ['borrowed', 'return_requested']).exists?
      errors.add(:base, "Cannot delete book while it is borrowed or pending return.")
      throw :abort
    end
  end
end