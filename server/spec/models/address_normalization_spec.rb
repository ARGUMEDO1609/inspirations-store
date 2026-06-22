require 'rails_helper'

RSpec.describe 'Address normalization', type: :model do
  let(:user) { create(:user, address: 'Calle 123 #45-67') }
  let(:order) { create(:order, user: user, shipping_address: 'Cra 10 #20-30') }

  it 'creates a home Address record from legacy user.address' do
    address = user.primary_address_record

    expect(address).to be_present
    expect(address.address_type).to eq('home')
    expect(address.address_line_1).to eq('Calle 123 #45-67')
  end

  it 'creates a shipping Address record from legacy order.shipping_address' do
    address = order.shipping_address_record

    expect(address).to be_present
    expect(address.address_type).to eq('shipping')
    expect(address.address_line_1).to eq('Cra 10 #20-30')
  end

  it 'syncs user.address when the address record changes' do
    user.primary_address_record.update!(address_line_1: 'Nueva direccion 999')

    expect(user.reload.address).to eq('Nueva direccion 999')
  end

  it 'syncs order.shipping_address when the address record changes' do
    order.shipping_address_record.update!(address_line_1: 'Nueva entrega 888')

    expect(order.reload.shipping_address).to eq('Nueva entrega 888')
  end
end
