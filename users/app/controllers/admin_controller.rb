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

  def destroy_librarian
    return render json: { error: 'Forbidden' }, status: :forbidden unless @current_role == 'admin'
    librarian = User.find_by(id: params[:id], role: 'librarian')
    unless librarian
      return render json: { error: 'Librarian not found' }, status: :not_found
    end

    if librarian.destroy
      render json: { message: 'Librarian deleted successfully.' }
    else
      render json: { error: librarian.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  # GET /admin/users
  def users
    return render json: { error: 'Forbidden' }, status: :forbidden unless @current_role == 'admin'
    users = User.where(role: 'member').select(:id,:email, :created_at)
    render json: users
  end

  # DELETE /admin/users/:id
  def destroy_user
    return render json: { error: 'Forbidden' }, status: :forbidden unless @current_role == 'admin'
    user = User.find_by(id: params[:id])
    unless user
      return render json: { error: 'User not found' }, status: :not_found
    end

    # Prevent deletion if user has active borrowings
    if user.borrowings.where(status: ['borrowed', 'return_requested']).exists?
      return render json: { error: 'Cannot delete user with active or pending borrowings.' }, status: :unprocessable_entity
    end

    if user.destroy
      render json: { message: 'User deleted successfully.' }
    else
      render json: { error: user.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  private

  def ensure_admin!
    render json: { error: 'Forbidden' }, status: :forbidden unless @current_role == 'admin'
  end
end