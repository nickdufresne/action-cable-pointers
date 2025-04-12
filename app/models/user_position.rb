class UserPosition < ApplicationRecord
  validates :user_id, presence: true, uniqueness: true
  validates :name, presence: true
  validates :x, presence: true
  validates :y, presence: true

  def self.all_positions
    cleanup_inactive_positions
    all.map { |pos| { user_id: pos.user_id, name: pos.name, x: pos.x, y: pos.y } }
  end

  def self.update_position(user_id, name, x, y)
    position = find_or_initialize_by(user_id: user_id)
    position.name = name
    position.x = x
    position.y = y
    position.save!
  end

  def self.remove_position(user_id)
    where(user_id: user_id).destroy_all
  end

  def self.cleanup_inactive_positions
    where("updated_at < ?", 1.minute.ago).destroy_all
  end
end
