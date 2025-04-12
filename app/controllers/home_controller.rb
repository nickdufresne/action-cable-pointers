class HomeController < ApplicationController
  def index
  end

  def square
    @user_name = params[:name]
    @user_id = params[:user_id] || SecureRandom.uuid
  end
end
