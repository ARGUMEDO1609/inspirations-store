require 'rails_helper'

RSpec.describe WebhookEvent, type: :model do
  describe '.claim' do
    it 'claims a new event successfully' do
      result = WebhookEvent.claim(provider: "wompi", event_key: "wompi:tx-123:approved")

      expect(result).to be true
      expect(WebhookEvent.count).to eq(1)
    end

    it 'rejects duplicate events' do
      WebhookEvent.claim(provider: "wompi", event_key: "wompi:tx-123:approved")
      result = WebhookEvent.claim(provider: "wompi", event_key: "wompi:tx-123:approved")

      expect(result).to be false
      expect(WebhookEvent.count).to eq(1)
    end

    it 'allows same event_key for different providers' do
      WebhookEvent.claim(provider: "wompi", event_key: "wompi:tx-123:approved")
      result = WebhookEvent.claim(provider: "other", event_key: "wompi:tx-123:approved")

      expect(result).to be true
      expect(WebhookEvent.count).to eq(2)
    end
  end

  describe '.release' do
    it 'removes a claimed event' do
      WebhookEvent.claim(provider: "wompi", event_key: "wompi:tx-123:approved")
      WebhookEvent.release(provider: "wompi", event_key: "wompi:tx-123:approved")

      expect(WebhookEvent.count).to eq(0)
    end
  end
end
