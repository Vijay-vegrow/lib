# app/controllers/books_controller.rb
class BooksController < ApplicationController
  before_action :authenticate_request!
  before_action :set_book, only: [:show, :update, :destroy]
  before_action :require_admin_or_librarian, only: [:create, :update, :destroy]

  def index
    books = Book.where(available: true)
    books = books.where("title LIKE ?", "%#{params[:q]}%") if params[:q].present?
    render json: books
  end

  def show
    render json: @book
  end

  def create
    book = Book.new(book_params)
    if book.save
      render json: book, status: :created
    else
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
    @book.destroy
    head :no_content
  end

  private

  def set_book
    @book = Book.find(params[:id])
  end

  def book_params
    params.permit(:title, :author, :publication_year, :publisher, :image_url, :available)
  end

  def require_admin_or_librarian
    unless @current_role.in?(%w[admin librarian])
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end
end