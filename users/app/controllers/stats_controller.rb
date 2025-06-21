class StatsController < ApplicationController
  before_action :authenticate_request!
  before_action :require_admin_or_librarian

  def summary
    render json: {
      total_books: Book.count,
      total_borrowings: Borrowing.count,
      active_borrowings: Borrowing.where(status: 'borrowed').count,
      pending_returns: Borrowing.where(status: 'return_requested').count,
      active_members: Borrowing.where('borrowed_at > ?', 30.days.ago).select(:user_id).distinct.count,
      hot_books: Book.joins(:borrowings)
        .group('books.id')
        .order('COUNT(borrowings.id) DESC')
        .limit(5)
        .pluck('books.title', 'COUNT(borrowings.id) as borrow_count')
    }
  end

  def borrow_trends
    # Returns [{date: '2025-06-01', count: 5}, ...]
    data = Borrowing.group("DATE(borrowed_at)").order("DATE(borrowed_at)").count
    render json: data.map { |date, count| { date: date, count: count } }
  end

  def hot_books
    books = Book.joins(:borrowings)
      .group('books.id')
      .order('COUNT(borrowings.id) DESC')
      .limit(10)
      .select('books.*, COUNT(borrowings.id) as borrow_count')
    render json: books.as_json(methods: :borrow_count)
  end
end