class CartChannel < ApplicationCable::Channel
  def subscribed
    stream_from "cart_channel_#{current_user.id}"
  end
end
