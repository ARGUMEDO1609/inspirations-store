ActiveAdmin.register Category do
  menu false
  permit_params :name, :slug, :description, :image

  controller do
    def create
      super do |success, failure|
        success.html { redirect_to admin_categories_path, notice: 'Categoría creada' }
        failure.html { render :new }
      end
    end

    def update
      super do |success, failure|
        success.html { redirect_to admin_categories_path, notice: 'Categoría actualizada' }
        failure.html { render :edit }
      end
    end
  end

  index title: 'Categorías' do
    selectable_column
    id_column
    column('Categoría') do |category|
      div style: 'display:flex; gap:12px; align-items:center;' do
        if category.image.attached?
          image_tag rails_storage_proxy_url(category.image, only_path: true), style: 'width:56px; height:56px; object-fit:cover; border-radius:14px; border:1px solid #e5e7eb;'
        else
          div 'Sin imagen', style: 'width:56px; height:56px; display:flex; align-items:center; justify-content:center; background:#f3f4f6; border-radius:14px; color:#6b7280; font-size:11px;'
        end

        div do
          div { strong link_to category.name, admin_category_path(category) }
          div category.slug, style: 'color:#6b7280; font-size:12px; margin-top:4px;'
        end
      end
    end
    column('Descripción') { |category| truncate(category.description, length: 70) }
    column('Productos') { |category| category.products.count }
    column('Creada') { |category| l(category.created_at, format: :short) }
    actions
  end

  filter :name
  filter :slug
  filter :created_at

  form html: { multipart: true } do |f|
    f.semantic_errors(*f.object.errors.attribute_names)

    f.inputs 'Identidad de categoría' do
      para 'Crea una categoría con nombre claro, URL consistente y una descripción útil para catálogo y admin.', style: 'margin:0 0 12px; color:#6b7280;'
      f.input :name, hint: 'Debe ser clara para cliente y operación interna.'
      f.input :slug, hint: 'Ayuda a mantener URLs limpias y organización consistente.'
      f.input :description, as: :text, input_html: { rows: 5 }, hint: 'Resume el tipo de piezas que agrupa esta categoría.'
    end

    f.inputs 'Imagen representativa' do
      f.input :image,
              as: :file,
              label: 'Subir imagen de categoría',
              hint: f.object.image.attached? ?
                image_tag(rails_storage_proxy_url(f.object.image, only_path: true), style: 'width:180px; border-radius:18px; border:1px solid #e5e7eb;') :
                content_tag(:span, 'Todavía no hay imagen cargada para esta categoría.')
    end

    f.actions do
      f.action :submit, label: f.object.new_record? ? 'Crear categoría' : 'Guardar cambios'
      f.cancel_link admin_categories_path
    end
  end

  sidebar 'Guía de categoría', only: %i[new edit] do
    div style: 'display:grid; gap:14px;' do
      div do
        strong 'Recomendaciones'
      end
      ul style: 'padding-left:18px; margin:0; line-height:1.8; color:#4b5563;' do
        li 'Usa nombres fáciles de escanear en filtros y navegación.'
        li 'Evita categorías demasiado solapadas entre sí.'
        li 'La imagen debe representar bien el universo visual de la categoría.'
      end
    end
  end

  sidebar 'Estado actual', only: %i[edit] do
    if resource.persisted?
      attributes_table_for resource do
        row('Slug', &:slug)
        row('Productos asociados') { |record| record.products.count }
        row('Actualizada') { |record| l(record.updated_at, format: :short) }
      end
    end
  end

  show title: proc { |category| category.name } do
    columns do
      column do
        panel 'Vista de categoría' do
          if category.image.attached?
            div style: 'margin-bottom:16px;' do
              image_tag rails_storage_proxy_url(category.image, only_path: true), style: 'width:100%; max-width:420px; border-radius:22px; border:1px solid #e5e7eb;'
            end
          end

          attributes_table_for category do
            row :name
            row :slug
            row('Descripción') { |record| simple_format(record.description) }
            row('Productos asociados') { |record| record.products.count }
            row :created_at
            row :updated_at
          end
        end
      end
    end
  end
end
