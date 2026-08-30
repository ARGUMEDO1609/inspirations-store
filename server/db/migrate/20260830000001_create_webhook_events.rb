class CreateWebhookEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :webhook_events do |t|
      t.string :provider, null: false
      t.string :event_key, null: false
      t.datetime :processed_at, null: false

      t.timestamps
    end
    add_index :webhook_events, [ :provider, :event_key ], unique: true, name: "idx_webhook_events_provider_event_key"
  end
end
