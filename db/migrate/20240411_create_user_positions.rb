class CreateUserPositions < ActiveRecord::Migration[8.0]
  def change
    create_table :user_positions do |t|
      t.string :user_id, null: false
      t.string :name, null: false
      t.integer :x, null: false
      t.integer :y, null: false
      t.timestamps
    end

    add_index :user_positions, :user_id, unique: true
  end
end
