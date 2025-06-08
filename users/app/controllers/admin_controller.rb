class AdminController < ApplicationController
  before_action :authenticate_request!

  def dashboard
    render json: { message: "Welcome admin, #{@current_user.email}" }
  end
end