class PositionChannel < ApplicationCable::Channel
  def subscribed
    puts "Subscribed to position_updates"
    stream_from "position_updates"

    # Set initial position when user subscribes
    user_id = params[:user_id]
    name = params[:name]
    UserPosition.update_position(user_id, name, 200, 200)

    # Broadcast current positions to all clients
    broadcast_positions
  end

  def unsubscribed
    puts "Unsubscribed from position_updates"
    UserPosition.remove_position(params[:user_id])
    broadcast_positions
  end

  def update_position(data)
    puts "Updating position for user #{data['user_id']}"
    UserPosition.update_position(
      data["user_id"],
      data["name"],
      data["x"],
      data["y"]
    )
    broadcast_positions
  end

  private

  def broadcast_positions
    puts "Broadcasting positions"
    ActionCable.server.broadcast(
      "position_updates",
      { positions: UserPosition.all_positions }
    )
  end
end
