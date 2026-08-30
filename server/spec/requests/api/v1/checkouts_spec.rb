require 'rails_helper'

RSpec.describe 'API V1 Checkouts', type: :request do
  let(:user) { create(:user) }
  let(:product) { create(:product) }
  let(:cart_item) { create(:cart_item, user: user, product: product, quantity: 1) }

  before do
    allow_any_instance_of(Api::V1::ApiController).to receive(:current_user).and_return(user)
    ENV['WOMPI_PUBLIC_KEY'] = 'pk_test_checkouts'
    ENV['WOMPI_INTEGRITY_KEY'] = 'integrity_test_checkouts'
  end

  after do
    ENV.delete('WOMPI_PUBLIC_KEY')
    ENV.delete('WOMPI_INTEGRITY_KEY')
  end

  describe 'POST /api/v1/checkout' do
    context 'with cart items' do
      before { cart_item }

      it 'builds an order and returns a checkout URL' do
        post '/api/v1/checkout', params: { checkout: { shipping_address: 'Calle 123' } }, as: :json

        expect(response).to have_http_status(:created)
        parsed = JSON.parse(response.body)
        checkout_url = parsed.dig('data', 'checkout_url')
        query = Rack::Utils.parse_query(URI.parse(checkout_url).query)

        expect(checkout_url).to include('https://checkout.wompi.co/p/')
        expect(query['signature:integrity']).to be_present
        expect(Order.last.reference).to be_present
      end
    end

    context 'with empty cart' do
      it 'returns an error' do
        post '/api/v1/checkout', params: { checkout: { shipping_address: 'Calle 123' } }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        parsed = JSON.parse(response.body)
        expect(parsed['error']).to eq('Cart is empty')
      end
    end

    context 'when Wompi is misconfigured' do
      before do
        cart_item
        ENV.delete('WOMPI_PUBLIC_KEY')
        ENV['WOMPI_INTEGRITY_KEY'] = 'integrity_test_checkouts'
      end

      it 'returns a configuration error' do
        post '/api/v1/checkout', params: { checkout: { shipping_address: 'Calle 123' } }, as: :json

        expect(response).to have_http_status(:unprocessable_content)
        parsed = JSON.parse(response.body)
        expect(parsed['error']).to eq('No pudimos preparar el pago')
      end
    end
  end
end
