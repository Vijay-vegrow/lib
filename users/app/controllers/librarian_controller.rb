class LibrarianController < ApplicationController
  before_action :authenticate_request!

  def dashboard
    render json: { message: "Welcome librarian, #{@current_user.email}" }
  end
end