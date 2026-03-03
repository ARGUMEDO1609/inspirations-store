require 'rails_helper'

RSpec.describe Api::V1::CategoriesController, type: :controller do
  let(:user) { create(:user) }
  let(:admin) { create(:admin_user) }
  let(:category) { create(:category) }

  describe 'GET #index' do
    it 'returns all categories' do
      category
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET #show' do
    it 'returns the category' do
      get :show, params: { id: category.id }
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    context 'as admin' do
      before { sign_in admin }

      it 'creates a category' do
        post :create, params: { category: { name: 'New Category' } }
        expect(response).to have_http_status(:created)
      end
    end

    context 'as regular user' do
      before { sign_in user }

      it 'returns forbidden' do
        post :create, params: { category: { name: 'New Category' } }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
