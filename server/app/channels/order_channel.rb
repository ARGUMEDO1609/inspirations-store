class OrderChannel < ApplicationCable::Channel
  def subscribed
    stream_from "order_channel_#{current_user.id}"
  end
end
