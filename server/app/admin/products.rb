ActiveAdmin.register Product do
  menu false
  permit_params :title, :description, :price, :stock, :category_id, :image, :slug

  controller do
    def create
      super do |success, failure|
        success.html { redirect_to admin_products_path, notice: 'Producto creado' }
        failure.html { render :new }
      end
    end

    def update
      super do |success, failure|
        success.html { redirect_to admin_products_path, notice: 'Producto actualizado' }
        failure.html { render :edit }
      end
    end
  end

  index title: 'Productos' do
    selectable_column

    column('Pieza') do |product|
      div style: 'display:flex; gap:12px; align-items:center;' do
        if product.image.attached?
          image_tag rails_storage_proxy_url(product.image, only_path: true), style: 'width:64px; height:64px; object-fit:cover; border-radius:16px; border:1px solid #e5e7eb;'
        else
          div 'Sin imagen', style: 'width:64px; height:64px; display:flex; align-items:center; justify-content:center; background:#f3f4f6; border-radius:16px; color:#6b7280; font-size:11px;'
        end

        div do
          div do
            strong link_to product.title, admin_product_path(product)
          end
          div product.slug, style: 'color:#6b7280; font-size:12px; margin-top:4px;'
        end
      end
    end

    column('Categoría', &:category)

    column('Precio') do |product|
      strong number_to_currency(product.price)
    end

    column('Stock') do |product|
      if product.stock <= 3
        status_tag "Bajo: #{product.stock}", class: 'warning'
      elsif product.stock.zero?
        status_tag 'Sin stock', class: 'error'
      else
        status_tag "OK: #{product.stock}", class: 'ok'
      end
    end

    column('Movimiento') do |product|
      product.order_items.sum(:quantity)
    end

    column('Creado') { |product| l(product.created_at, format: :short) }

    actions
  end

  filter :title
  filter :category
  filter :price
  filter :stock
  filter :created_at

  form html: { multipart: true } do |f|
    f.inputs 'Información base' do
      f.input :category
      f.input :title
      f.input :description
      f.input :price
      f.input :stock
      f.input :slug
    end

    f.inputs 'Imagen' do
      f.input :image, as: :file, label: 'Subir nueva imagen', hint: f.object.image.attached? ?
        image_tag(rails_storage_proxy_url(f.object.image, only_path: true), style: 'width:140px; border-radius:16px;') :
        content_tag(:span, 'Sin imagen cargada.')
    end
    f.actions
  end

  show title: proc { |product| product.title } do
    columns do
      column do
        panel 'Vista de producto' do
          if product.image.attached?
            div style: 'margin-bottom:16px;' do
              image_tag rails_storage_proxy_url(product.image, only_path: true), style: 'width:100%; max-width:460px; border-radius:24px; border:1px solid #e5e7eb;'
            end
          end

          attributes_table_for product do
            row :title
            row :slug
            row :category
            row('Precio') { |record| number_to_currency(record.price) }
            row :stock
            row :created_at
            row :updated_at
          end
        end
      end

      column do
        panel 'Descripción y operación' do
          attributes_table_for product do
            row('Descripción') { |record| simple_format(record.description) }
            row('Pedidos asociados') { |record| record.order_items.count }
            row('Unidades vendidas') { |record| record.order_items.sum(:quantity) }
            row('Reseñas') { |record| record.reviews.count }
          end
        end
      end
    end
  end
end
