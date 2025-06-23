class AuthController < ApplicationController

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

  def google_oauth2_token
    id_token = params[:credential] || params[:id_token] || params[:access_token]
    if id_token.blank?
      render json: { error: 'No ID token provided' }, status: :bad_request and return
    end

    validator = GoogleIDToken::Validator.new
    begin
      payload = validator.check(id_token, ENV['GOOGLE_CLIENT_ID'])
      email = payload['email']
      user = User.find_by(email: email)
      unless user
        # User does not exist, ask frontend to select role
        render json: { email: email }, status: :ok and return
      end

      # Block unapproved librarians
      if user.role == 'librarian' && user.status != 'approved'
        render json: { error: 'Librarian account not approved by admin.' }, status: :unauthorized and return
      end

      token = JsonWebToken.encode(user_id: user.id, role: user.role)
      render json: { token: token, role: user.role }, status: :ok
    rescue => e
      Rails.logger.error "Google OAuth error: #{e.message}"
      render json: { error: 'Invalid Google ID token' }, status: :unauthorized
    end
  end

  def logout
    token = request.headers['Authorization']&.split(' ')&.last
    if token
      # Set the token in Redis with a 1-day expiry
      $redis.setex("blacklist:#{token}", 24.hours.to_i, 1)
    end
    render json: { message: 'Logged out' }
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