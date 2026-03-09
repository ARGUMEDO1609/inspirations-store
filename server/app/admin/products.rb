ActiveAdmin.register Product do
  menu false
  permit_params :title, :description, :price, :stock, :category_id, :image, :slug

  controller do
    def create
      super do |success, failure|
        success.html { redirect_to admin_products_path, notice: "Producto creado" }
        failure.html { render :new }
      end
    end

    def update
      super do |success, failure|
        success.html { redirect_to admin_products_path, notice: "Producto actualizado" }
        failure.html { render :edit }
      end
    end
  end

  index do
    selectable_column
    id_column
    column :title
    column :category
    column :image do |product|
      if product.image.attached?
        image_tag rails_storage_proxy_url(product.image, only_path: true), width: 100
      end
    end
    column :price
    column :stock
    column :created_at
    actions
  end

  filter :title
  filter :category
  filter :price
  filter :stock

  form html: { multipart: true } do |f|
    f.inputs do
      f.input :category
      f.input :title
      f.input :description
      f.input :price
      f.input :stock
      f.input :image, as: :file, label: "Subir Nueva Imagen", hint: f.object.image.attached? ?
        content_tag(:span, "Imagen actual: ") + image_tag(rails_storage_proxy_url(f.object.image, only_path: true), width: 100) :
        content_tag(:span, "Sin imagen cargada. Selecciona un archivo para subir una nueva imagen.")
      f.input :slug
    end
    f.actions
  end

  show do |product|
    attributes_table do
      row :image do
        if product.image.attached?
          image_tag rails_storage_proxy_url(product.image, only_path: true), width: 200
        end
      end
      row :title
      row :category
      row :description
      row :price
      row :stock
      row :slug
    end
  end
end
