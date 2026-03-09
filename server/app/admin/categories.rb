ActiveAdmin.register Category do
  permit_params :name, :slug, :description, :image

  controller do
    def create
      super do |success, failure|
        success.html { redirect_to admin_categories_path, notice: "Categoría creada" }
        failure.html { render :new }
      end
    end

    def update
      super do |success, failure|
        success.html { redirect_to admin_categories_path, notice: "Categoría actualizada" }
        failure.html { render :edit }
      end
    end
  end

  index do
    selectable_column
    id_column
    column :name
    column :slug
    column :description
    column :image do |category|
      if category.image.attached?
        image_tag rails_storage_proxy_url(category.image, only_path: true), width: 100
      end
    end
    column :created_at
    actions
  end

  filter :name
  filter :slug

  form html: { multipart: true } do |f|
    f.inputs do
      f.input :name
      f.input :slug
      f.input :description, as: :text
      f.input :image, as: :file, label: "Subir Nueva Imagen", hint: f.object.image.attached? ? 
        content_tag(:span, "Imagen actual: ") + image_tag(rails_storage_proxy_url(f.object.image, only_path: true), width: 100) : 
        content_tag(:span, "Sin imagen cargada")
    end
    f.actions
  end
end
