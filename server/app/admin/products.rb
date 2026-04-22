ActiveAdmin.register Product do
  menu false
  permit_params :title, :description, :price, :stock, :category_id, :image, :sizes_data

  controller do
    def create
      build_resource
      resource.assign_attributes(product_params.except(:sizes_data))
      apply_sizes_data

      if resource.save
        redirect_to admin_products_path, notice: "Producto creado"
      else
        render :new, status: :unprocessable_entity
      end
    end

    def destroy
      super do |success, failure|
        success.html { redirect_to admin_products_path, notice: "Producto eliminado" }
        failure.html { redirect_to admin_products_path, alert: "No se pudo eliminar" }
      end
    end

    def update
      resource.assign_attributes(product_params.except(:sizes_data))
      apply_sizes_data

      if resource.save
        redirect_to admin_products_path, notice: "Producto actualizado"
      else
        render :edit, status: :unprocessable_entity
      end
    end

    private

    def apply_sizes_data
      raw = params[:product][:sizes_data].to_s
      return if raw.blank?

      desired_sizes = parse_sizes_data(raw)
      existing_sizes = resource.variants.select { |variant| variant.variant_type == "size" }
      existing_by_name = existing_sizes.index_by { |variant| variant.name.to_s.downcase }

      desired_sizes.each do |attrs|
        existing_variant = existing_by_name.delete(attrs[:key])

        if existing_variant
          existing_variant.assign_attributes(name: attrs[:name], stock: attrs[:stock])
        else
          resource.variants.build(name: attrs[:name], variant_type: "size", stock: attrs[:stock])
        end
      end

      existing_by_name.each_value do |variant|
        next if variant.new_record?

        if variant_in_use?(variant)
          variant.stock = 0
        else
          variant.mark_for_destruction
        end
      end
    end

    def parse_sizes_data(raw)
      raw.split(",").filter_map do |entry|
        entry = entry.to_s.strip
        next if entry.blank?

        name, stock = entry.split(":", 2).map { |part| part.to_s.strip }
        next if name.blank?

        {
          key: name.downcase,
          name: name,
          stock: stock.present? ? stock.to_i : 0
        }
      end
    end

    def variant_in_use?(variant)
      CartItem.exists?(variant_id: variant.id) || OrderItem.exists?(variant_id: variant.id)
    end

    def product_params
      permitted = params.require(:product).permit(:title, :description, :price, :stock, :category_id, :image, :sizes_data)
      permitted[:price] = normalize_price_value(permitted[:price])
      permitted
    end

    def normalize_price_value(raw_price)
      raw_price = raw_price.to_s.strip
      return raw_price if raw_price.blank?

      normalized_price = raw_price.gsub(/[^\d,\.]/, "")
      normalized_price = normalized_price.delete(".").tr(",", ".")
      normalized_price.presence || raw_price
    end
  end

  index title: "Productos" do
    selectable_column

    column("Pieza") do |product|
      div style: "display:flex; gap:12px; align-items:center;" do
        if product.image.attached?
          image_tag rails_storage_proxy_url(product.image, only_path: true), style: "width:64px; height:64px; object-fit:cover; border-radius:16px; border:1px solid #e5e7eb;"
        else
          div "Sin imagen", style: "width:64px; height:64px; display:flex; align-items:center; justify-content:center; background:#f3f4f6; border-radius:16px; color:#6b7280; font-size:11px;"
        end

        div do
          div do
            strong link_to product.title, admin_product_path(product)
          end
        end
      end
    end

    column("Categoría", &:category)

    column("Precio") do |product|
      strong number_to_currency(product.price)
    end

    column("Stock") do |product|
      if product.stock <= 3
        status_tag "Bajo: #{product.stock}", class: "warning"
      elsif product.stock.zero?
        status_tag "Sin stock", class: "error"
      else
        status_tag "OK: #{product.stock}", class: "ok"
      end
    end

    column("Movimiento") do |product|
      product.order_items.sum(:quantity)
    end

    column("Creado") { |product| l(product.created_at, format: :short) }

    actions
  end

  filter :title
  filter :category
  filter :price
  filter :stock
  filter :created_at

  form html: { multipart: true } do |f|
    f.semantic_errors(*f.object.errors.attribute_names)

    f.inputs "Curaduría base" do
      para "Define la pieza principal del catálogo con un nombre claro y una categoría correcta.", style: "margin:0 0 12px; color:#6b7280;"
      f.input :category, hint: "La categoría afecta organización, navegación y filtros del storefront."
      f.input :title, hint: "Usa un título corto, memorable y consistente con el tono de la tienda."
    end

    f.inputs "Narrativa y operación" do
      para "Aquí defines lo que verá el cliente y lo que necesita el equipo para operar.", style: "margin:0 0 12px; color:#6b7280;"
      f.input :description, as: :text, input_html: { rows: 6 }, hint: "Describe materiales, carácter visual o propósito de la pieza."
      f.input :price, hint: "El valor se refleja directo en catálogo, detalle y checkout."
      f.input :stock, hint: "Mantén el stock real para que las reservas de pedido sean confiables."
    end

    f.inputs "Imagen y presencia visual" do
      f.input :image,
              as: :file,
              label: "Subir imagen principal"
    end

    f.inputs "Tallas" do
      f.input :sizes_data, label: "Tallas con stock", placeholder: "ej: S:10, M:15, L:8", hint: "Formato: TALLA:STOCK, separado por coma. ej: S:10, M:12, L:5"
    end

    if f.object.persisted? && f.object.variants.any?
      f.inputs "Tallas existentes" do
        f.object.variants.each do |variant|
          div style: "display:flex; align-items:center; gap:12px; padding:4px 0;" do
            span variant.name, style: "font-weight:600;"
            span "#{variant.stock} unidades", style: "color:#6b7280; font-size:12px;"
            span "##{variant.id}", style: "color:#9ca3af; font-size:12px;"
          end
        end
      end
    end

    f.actions do
      f.action :submit, label: f.object.new_record? ? "Crear producto" : "Guardar cambios"
      f.cancel_link admin_products_path
    end
  end

  sidebar "Guía de producto", only: %i[new edit] do
    div style: "display:grid; gap:14px;" do
      div do
        strong "Antes de guardar"
      end
      ul style: "padding-left:18px; margin:0; line-height:1.8; color:#4b5563;" do
        li "Verifica que el título no duplique otra pieza."
        li "Confirma stock y precio antes de publicar."
        li "Sube una imagen con buena proporción y foco claro."
      end
    end
  end

  sidebar "Vista rápida", only: %i[edit] do
    if resource.persisted?
      attributes_table_for resource do
        row("Stock", &:stock)
        row("Pedidos asociados") { |record| record.order_items.count }
        row("Reseñas") { |record| record.reviews.count }
      end
    end
  end

  show title: proc { |product| product.title } do
    columns do
      column do
        panel "Vista de producto" do
          if product.image.attached?
            div style: "margin-bottom:16px;" do
              image_tag rails_storage_proxy_url(product.image, only_path: true), style: "width:100%; max-width:460px; border-radius:24px; border:1px solid #e5e7eb;"
            end
          end

          attributes_table_for product do
            row :title
            row :category
            row("Precio") { |record| number_to_currency(record.price) }
            row :stock
            row :created_at
            row :updated_at
          end
        end
      end

      column do
        panel "Descripción y operación" do
          attributes_table_for product do
            row("Descripción") { |record| simple_format(record.description) }
            row("Pedidos asociados") { |record| record.order_items.count }
            row("Unidades vendidas") { |record| record.order_items.sum(:quantity) }
            row("Reseñas") { |record| record.reviews.count }
          end
        end
      end
    end
  end
end
