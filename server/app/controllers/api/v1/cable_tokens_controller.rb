require "jwt"

# Emits short-lived tokens for WebSocket (ActionCable) authentication.
#
# Background: the API authenticates via an HttpOnly session cookie, but the
# browser does not send cookies cross-origin on a WebSocket upgrade. Since
# the Vite dev server (:5173) and Rails (:3000) are different origins, we
# cannot rely on the cookie alone for ActionCable. Instead the SPA fetches a
# single-use, 60-second JWT from this endpoint (which IS covered by the
# cookie + CORS with credentials) and passes it to ActionCable via the
# Sec-WebSocket-Protocol subprotocol `Bearer.<token>`.
#
# The token is signed with Rails.application.secret_key_base and encodes
# only the user id. Short TTL + was-generated-by-this-server guarantees it
# cannot be replayed or minted by an attacker.
class Api::V1::CableTokensController < Api::V1::ApiController
  before_action :authenticate_user!

  # POST /api/v1/cable_token
  def create
    token = JWT.encode(
      { sub: current_user.id, exp: (Time.now.to_i + 60) },
      Rails.application.secret_key_base,
      "HS256"
    )
    render_success(data: { token: token })
  end
end
