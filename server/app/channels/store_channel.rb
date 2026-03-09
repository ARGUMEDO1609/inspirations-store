class StoreChannel < ApplicationCable::Channel
  def subscribed
    stream_from "store_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
