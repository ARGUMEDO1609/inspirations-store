ActiveAdmin.register Review do
  menu false
  permit_params :rating, :comment, :user_id, :reviewable_type, :reviewable_id

  includes :user

  index title: "Reseñas" do
    selectable_column
    column("ID") { |review| link_to("R#{review.id.to_s.rjust(4, '0')}", admin_review_path(review)) }
    column("Cliente") do |review|
      div do
        strong(review.user&.name || "Sin nombre")
      end
      div(review.user&.email || "Sin correo", style: "color:#6b7280; font-size:12px; margin-top:2px;")
    end
    column("Objeto") do |review|
      status = review.reviewable_type&.underscore&.humanize
      div do
        span(status, style: "font-size:12px; color:#1f2937; font-weight:700;")
      end
      div("##{review.reviewable_id}", style: "color:#6b7280; font-size:12px;")
    end
    column("Rating") { |review| status_tag(review.rating, class: review.rating.to_i >= 4 ? "ok" : "warning") }
    column("Comentario") { |review| truncate(review.comment, length: 80) }
    column("Creada") { |review| l(review.created_at, format: :short) }
    actions
  end

  filter :user
  filter :reviewable_type, as: :select, collection: %w[Product Category]
  filter :rating, as: :select, collection: (1..5)
  filter :created_at

  form do |f|
    f.semantic_errors(*f.object.errors.attribute_names)

    f.inputs "Contexto" do
      f.input :user, include_blank: "Selecciona cliente"
      f.input :reviewable_type, as: :select, collection: %w[Product Category], include_blank: "Selecciona tipo"
      f.input :reviewable_id, label: "ID del objeto (usa el filtro para buscar)", hint: "Puedes revisar el catálogo para identificar la pieza o categoría activa."
    end

    f.inputs "Detalle de la reseña" do
      f.input :rating, as: :select, collection: 1..5, hint: "1 = mala, 5 = excelente"
      f.input :comment, as: :text, input_html: { rows: 5 }
    end

    f.actions do
      f.action :submit, label: f.object.new_record? ? "Guardar reseña" : "Actualizar reseña"
      f.cancel_link admin_reviews_path
    end
  end

  sidebar "Guía rápida", only: %i[new edit] do
    div do
      strong "Resumen"
      para "Revisa que la reseña apunte al objeto correcto antes de guardar y completa el puntaje si falta.", style: "color:#6b7280;"
    end
  end
end
