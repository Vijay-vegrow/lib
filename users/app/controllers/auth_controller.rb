class AuthController < ApplicationController
  skip_before_action :verify_authenticity_token

  def signup_admin
    signup('admin')
  end

  def signup_librarian
    signup('librarian')
  end

  def signup_member
    signup('member')
  end

  def login
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id, role: user.role)
      dashboard_path =
        case user.role
        when 'admin'
          '/admin/dashboard'
        when 'librarian'
          '/librarian/dashboard'
        when 'member'
          '/member/dashboard'
        else
          '/'
        end
      render json: { token: token, role: user.role, redirect_to: dashboard_path }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  private
  def signup(role)
    user = User.new(email: params[:email], password: params[:password], role: role)
    if user.save
      token = JsonWebToken.encode(user_id: user.id, role: user.role)
      render json: { token: token, role: user.role }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end