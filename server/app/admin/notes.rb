ActiveAdmin.register Note do
  menu false
  permit_params :notable_type, :notable_id, :body, :admin_user_id

  index title: 'Notas internas' do
    selectable_column
    column('Objeto') do |note|
      div do
        strong(note.notable_type)
      end
      div("##{note.notable_id}", style: 'color:#6b7280; font-size:12px;')
    end
    column('Creada por') { |note| note.admin_user&.email || 'Sin autor' }
    column('Nota') { |note| truncate(note.body, length: 80) }
    column('Creada') { |note| l(note.created_at, format: :short) }
    actions
  end

  filter :notable_type, as: :select, collection: %w[User Product Order]
  filter :admin_user
  filter :created_at

  form do |f|
    f.semantic_errors(*f.object.errors.attribute_names)

    f.inputs 'Contexto' do
      f.input :admin_user, as: :select, collection: AdminUser.all.map { |a| [a.email, a.id] }, prompt: 'Selecciona autor'
      f.input :notable_type, as: :select, collection: %w[User Product Order], include_blank: 'Tipo de entidad'
      f.input :notable_id, hint: 'Usa el ID real del recurso enlazado (puedes copiar desde el show del recurso).'
    end

    f.inputs 'Contenido de la nota' do
      f.input :body, as: :text, input_html: { rows: 6 }, hint: 'Registra contexto operativo, inconvenientes o follow-ups.'
    end

    f.actions do
      f.action :submit, label: f.object.new_record? ? 'Guardar nota' : 'Actualizar nota'
      f.cancel_link admin_notes_path
    end
  end
end
