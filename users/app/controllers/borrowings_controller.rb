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
    render json: borrowings.as_json(
      include: {
        book: {},
        user: { only: [:email] },
        approved_by: { only: [:email, :name, :id] }
      }
    )
  end

  def create
    return render json: { error: 'Forbidden' }, status: :forbidden unless @current_role == 'member'
    book = Book.find(params[:book_id])

    # Prevent duplicate active borrowings of the same book
    existing = Borrowing.where(
      user_id: @current_user.id,
      book_id: book.id,
      status: ['borrowed', 'return_requested']
    ).exists?
    if existing
      return render json: { error: 'You have already borrowed this book and not yet returned it.' }, status: :unprocessable_entity
    end

    # Prevent borrowing more than 5 books at a time
    active_borrowings_count = Borrowing.where(
      user_id: @current_user.id,
      status: ['borrowed', 'return_requested']
    ).count
    if active_borrowings_count >= 5
      return render json: { error: 'You cannot borrow more than 5 books at a time.' }, status: :unprocessable_entity
    end

    if book.availability_count <= 0
      return render json: { error: 'Book not available' }, status: :unprocessable_entity
    end
    
    Borrowing.create!(user_id: @current_user.id, book_id: book.id, borrowed_at: Time.now)
    book.update!(availability_count: book.availability_count - 1)
    render json: { message: 'Book borrowed successfully' }
  end

  def return_book
    borrowing = Borrowing.find_by(id: params[:id], user_id: @current_user.id, status: 'borrowed')
    if borrowing
      borrowing.update!(status: 'return_requested')
      render json: { message: 'Return requested. Awaiting librarian approval.' }
    else
      render json: { error: 'Borrowing record not found or already requested.' }, status: :not_found
    end
  end

  def approve_return
    return render json: { error: 'Forbidden' }, status: :forbidden unless @current_role.in?(%w[librarian admin])
    borrowing = Borrowing.find_by(id: params[:id], status: 'return_requested')
    if borrowing
      borrowing.update!(status: 'returned', returned_at: Time.now, approved_by: @current_user)
      book = borrowing.book
      book.update!(availability_count: book.availability_count + 1)
      render json: { message: 'Return approved.' }
    else
      render json: { error: 'Borrowing record not found or not pending approval.' }, status: :not_found
    end
  end

  def pending_returns
    return render json: { error: 'Forbidden' }, status: :forbidden unless @current_role.in?(%w[librarian admin])
    borrowings = Borrowing.includes(:book, :user).where(status: 'return_requested')
    render json: borrowings.as_json(
      include: {
        book: {},
        user: { only: [:email] },
        approved_by: { only: [:email, :name, :id] }
      }
    )
  end
end