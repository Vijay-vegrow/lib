class AdminController < ApplicationController
  before_action :authenticate_request!
  before_action :ensure_admin!

  def dashboard
    render json: { message: "Welcome admin, #{@current_user.email}" }
  end

  def add_admin
    user = User.new(email: params[:email], password: params[:password], role: 'admin')
    if user.save
      render json: { message: "Admin created successfully." }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def pending_librarians
    librarians = User.where(role: 'librarian', status: 'pending').select(:id, :email)
    render json: librarians
  end

  def approved_librarians
    librarians = User.where(role: 'librarian', status: 'approved').select(:id, :email)
    render json: librarians
  end

  def approve_librarian
    librarian = User.find_by(id: params[:id], role: 'librarian', status: 'pending')
    if librarian
      librarian.update(status: 'approved')
      render json: { message: "Librarian approved." }
    else
      render json: { error: "Librarian not found or already approved." }, status: :not_found
    end
  end

  private

  def ensure_admin!
    render json: { error: 'Forbidden' }, status: :forbidden unless @current_role == 'admin'
  end
end