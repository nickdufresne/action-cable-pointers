require 'ostruct'
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      puts "Connection established"
      self.current_user = find_verified_user
      logger.add_tags 'ActionCable', current_user.id
    end

    private

    def find_verified_user
      # In a real application, you would verify the user here
      # For this demo, we'll just use a random ID
      OpenStruct.new(id: SecureRandom.uuid, name: "John Doe")
    end
  end
end 