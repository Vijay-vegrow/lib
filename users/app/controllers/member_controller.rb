class MemberController < ApplicationController
  before_action :authenticate_request!

  def dashboard
    render json: { message: "Welcome member, #{@current_user.email}" }
  end
end