class AddCompositeIndexes < ActiveRecord::Migration[8.1]
  def change
    # Orders: composite index for queries by user + status (admin scopes, order history)
    add_index :orders, [ :user_id, :status ], name: "idx_orders_user_status"

    # Orders: composite index for queries by user + created_at (index action)
    add_index :orders, [ :user_id, :created_at ], name: "idx_orders_user_created_at"

    # CartItems: composite index for find_or_initialize_by(user_id, product_id, variant_id)
    add_index :cart_items, [ :user_id, :product_id, :variant_id ], name: "idx_cart_items_user_product_variant"
  end
end
