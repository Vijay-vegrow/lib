class ApplicationController < ActionController::API
  private

  def authenticate_request!
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless header

    # Check if token is blacklisted
    if $redis.get("blacklist:#{header}")
      return render json: { error: 'Token has been revoked' }, status: :unauthorized
    end

    decoded = JsonWebToken.decode(header)
    if decoded
      @current_user = User.find_by(id: decoded[:user_id])
      @current_role = decoded[:role]
    end
    render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
  end

  def require_admin_or_librarian
    unless @current_user && (@current_user.role == 'admin' || @current_user.role == 'librarian')
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end
end
