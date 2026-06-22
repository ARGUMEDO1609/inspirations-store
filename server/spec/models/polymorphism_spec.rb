require 'rails_helper'

RSpec.describe 'Polymorphic models', type: :model do
  let(:user) { create(:user) }
  let(:order) { create(:order, user: user) }
  let(:product) { create(:product) }
  let(:category) { create(:category) }
  let(:admin_user) { AdminUser.create!(email: 'admin-polymorphism@example.com', password: 'password123', password_confirmation: 'password123') }

  it 'allows Address for User and Order' do
    user_address = Address.create!(addressable: user, address_line_1: '123 Main', city: 'Bogota')
    order_address = Address.create!(addressable: order, address_line_1: '456 Market', city: 'Bogota')

    expect(user_address.addressable).to eq(user)
    expect(order_address.addressable).to eq(order)
  end

  it 'rejects Address for unsupported types' do
    address = Address.new(addressable: product, address_line_1: '123 Main', city: 'Bogota')

    expect(address).not_to be_valid
    expect(address.errors[:addressable_type]).to be_present
  end

  it 'allows Review for Product and Category' do
    product_review = Review.create!(user: user, reviewable: product, rating: 5, comment: 'Muy buen producto')
    category_review = Review.create!(user: user, reviewable: category, rating: 4, comment: 'Muy buena categoria')

    expect(product_review.reviewable).to eq(product)
    expect(category_review.reviewable).to eq(category)
  end

  it 'rejects Review for unsupported types' do
    review = Review.new(user: user, reviewable: order, rating: 5, comment: 'Comentario invalido')

    expect(review).not_to be_valid
    expect(review.errors[:reviewable_type]).to be_present
  end

  it 'allows Note for User, Product and Order' do
    user_note = Note.create!(admin_user: admin_user, notable: user, body: 'Nota usuario')
    product_note = Note.create!(admin_user: admin_user, notable: product, body: 'Nota producto')
    order_note = Note.create!(admin_user: admin_user, notable: order, body: 'Nota pedido')

    expect(user_note.notable).to eq(user)
    expect(product_note.notable).to eq(product)
    expect(order_note.notable).to eq(order)
  end

  it 'exposes Order polymorphic associations' do
    address = Address.create!(addressable: order, address_line_1: '789 Central', city: 'Bogota')
    note = Note.create!(admin_user: admin_user, notable: order, body: 'Seguimiento interno')

    expect(order.addresses).to include(address)
    expect(order.notes).to include(note)
  end
end
