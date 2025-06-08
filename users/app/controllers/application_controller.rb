class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  private

  def authenticate_request!
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    decoded = JsonWebToken.decode(header)
    if decoded
      @current_user = User.find_by(id: decoded[:user_id])
      @current_role = decoded[:role]
    end
    render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
  end
end
