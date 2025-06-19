class AuthController < ApplicationController
  skip_before_action :verify_authenticity_token

  def signup_admin
    signup('admin')
  end

  def signup_librarian
    user = User.new(email: params[:email], password: params[:password], role: 'librarian', status: 'pending')
    if user.save
      render json: { message: "Signup successful! Await admin approval." }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def signup_member
    signup('member')
  end

  def login
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      if user.role == 'librarian' && user.status != 'approved'
        render json: { error: 'Librarian account not approved by admin.' }, status: :unauthorized
        return
      end
      token = JsonWebToken.encode({ user_id: user.id, role: user.role, exp: 24.hours.from_now.to_i })
      dashboard_path =
        case user.role
        when 'admin'
          '/admin/panel'
        when 'librarian'
          '/librarian/dashboard'
        when 'member'
          '/books'
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
      render json: { role: user.role }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end