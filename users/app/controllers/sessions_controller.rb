class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def assign_role
    user = User.find_by(email: params[:email])
    status = params[:role] == 'librarian' ? 'pending' : 'approved'

    unless user
      user = User.create!(
        email: params[:email],
        password: SecureRandom.hex(16),
        role: params[:role],
        status: status
      )
    else
      user.update(role: params[:role], status: status)
    end

    # Only issue token if librarian is approved or if not a librarian
    if user.role == 'librarian' && user.status != 'approved'
      render json: { error: 'Librarian account not approved by admin.' }, status: :unauthorized
    else
      token = JsonWebToken.encode(user_id: user.id, role: user.role)
      render json: { token: token, role: user.role }
    end
  end
end