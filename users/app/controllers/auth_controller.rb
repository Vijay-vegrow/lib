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

  def google_oauth2_token
    access_token = params[:access_token]
    if access_token.blank?
      render json: { error: 'No access token provided' }, status: :bad_request and return
    end

    begin
      client = Signet::OAuth2::Client.new(access_token: access_token)
      service = Google::Apis::Oauth2V2::Oauth2Service.new
      service.authorization = client
      profile = service.get_userinfo

      unless profile&.email
        render json: { error: 'Could not fetch Google profile' }, status: :unauthorized and return
      end

      user = User.find_by(email: profile.email)
      unless user
        # User does not exist, ask frontend to select role
        render json: { email: profile.email }, status: :ok and return
      end

      # Block unapproved librarians
      if user.role == 'librarian' && user.status != 'approved'
        render json: { error: 'Librarian account not approved by admin.' }, status: :unauthorized and return
      end

      token = JsonWebToken.encode(user_id: user.id, role: user.role)
      render json: { token: token, role: user.role }, status: :ok
    rescue => e
      Rails.logger.error "Google OAuth error: #{e.message}"
      render json: { error: 'Invalid Google token' }, status: :unauthorized
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