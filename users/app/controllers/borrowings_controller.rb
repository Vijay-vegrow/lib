# app/controllers/borrowings_controller.rb
class BorrowingsController < ApplicationController
  before_action :authenticate_request!

  def index
    if @current_role == 'member'
      borrowings = Borrowing.includes(:book).where(user_id: @current_user.id)
    elsif @current_role == 'admin' || @current_role == 'librarian'
      borrowings = Borrowing.includes(:book, :user).all
    else
      return render json: { error: 'Forbidden' }, status: :forbidden
    end
    render json: borrowings.as_json(include: :book)
  end

  def create
    return render json: { error: 'Forbidden' }, status: :forbidden unless @current_role == 'member'
    book = Book.find(params[:book_id])
    if !book.available
      return render json: { error: 'Book not available' }, status: :unprocessable_entity
    end
    Borrowing.create!(user_id: @current_user.id, book_id: book.id, borrowed_at: Time.now)
    book.update!(available: false)
    render json: { message: 'Book borrowed successfully' }
  end

  def return_book
    borrowing = Borrowing.find_by(id: params[:id], user_id: @current_user.id, returned_at: nil)
    if borrowing
      borrowing.update!(returned_at: Time.now)
      borrowing.book.update!(available: true)
      render json: { message: 'Book returned successfully' }
    else
      render json: { error: 'Borrowing record not found' }, status: :not_found
    end
  end
end