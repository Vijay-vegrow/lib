# app/controllers/books_controller.rb
class BooksController < ApplicationController
  before_action :authenticate_request!
  before_action :set_book, only: [:show, :update, :destroy]
  before_action :require_admin_or_librarian, only: [:create, :update, :destroy]

  def index
    books = Book.all
    if params[:q].present?
      q = "%#{params[:q].downcase}%"
      books = books.where(
        "LOWER(title) LIKE :q OR LOWER(author) LIKE :q OR LOWER(publisher) LIKE :q OR CAST(publication_year AS CHAR) LIKE :q",
        q: q
      )
    end
    books = books.page(params[:page]).per(params[:per_page] || 10)
    render json: {
      books: books,
      total: books.total_count,
      page: books.current_page,
      total_pages: books.total_pages
    }
  end

  def show
    render json: @book
  end

  def create
    book = Book.new(book_params)
    if book.save
      render json: book, status: :created
    else
      Rails.logger.error(book.errors.full_messages)
      render json: { errors: book.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @book.update(book_params)
      render json: @book
    else
      render json: { errors: @book.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @book.destroy
      head :no_content
    else
      render json: { error: @book.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  private

  def set_book
    @book = Book.find(params[:id])
  end

  def book_params
    params.require(:book).permit(:title, :author, :publication_year, :publisher, :image_url, :availability_count)
  end

  def require_admin_or_librarian
    unless @current_role.in?(%w[admin librarian])
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end
end