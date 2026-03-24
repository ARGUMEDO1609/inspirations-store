ActiveAdmin.register Order do
  menu false
  permit_params :status, :shipping_address, :payment_status, :payment_id

  scope :all, default: true
  scope :pending
  scope :paid
  scope :shipped
  scope :completed
  scope :cancelled

  batch_action :mark_as_shipped, if: proc { selection.any? } do |ids|
    Order.find(ids).each { |order| order.update!(status: :shipped) if order.paid? }
    redirect_to collection_path, notice: "Pedidos marcados como enviados."
  end

  batch_action :mark_as_completed, if: proc { selection.any? } do |ids|
    Order.find(ids).each { |order| order.update!(status: :completed) if order.shipped? }
    redirect_to collection_path, notice: "Pedidos marcados como completados."
  end

  member_action :mark_as_shipped, method: :put do
    resource.update!(status: :shipped)
    redirect_to resource_path(resource), notice: "Pedido marcado como enviado."
  end

  member_action :mark_as_completed, method: :put do
    resource.update!(status: :completed)
    redirect_to resource_path(resource), notice: "Pedido marcado como completado."
  end

  action_item :mark_as_shipped, only: :show, if: proc { resource.paid? } do
    link_to "Marcar como enviado", mark_as_shipped_admin_order_path(resource), method: :put
  end

  action_item :mark_as_completed, only: :show, if: proc { resource.shipped? } do
    link_to "Marcar como completado", mark_as_completed_admin_order_path(resource), method: :put
  end

  index title: "Pedidos" do
    selectable_column
    column("Pedido") do |order|
      div do
        strong link_to "##{order.id.to_s.rjust(6, '0')}", admin_order_path(order)
      end
      div order.created_at.strftime("%d/%m/%Y %H:%M"), style: "color:#6b7280; font-size:12px; margin-top:4px;"
    end

    column("Cliente") do |order|
      div do
        strong(order.user&.name || "Sin nombre")
      end
      div(order.user&.email || "Sin correo", style: "color:#6b7280; font-size:12px; margin-top:4px;")
    end

    column("Estado") do |order|
      status_tag order.status
    end

    column("Pago") do |order|
      payment_label = order.payment_status.presence || "sin confirmar"
      status_tag payment_label, class: payment_label.in?(%w[approved paid]) ? "ok" : (payment_label.in?(%w[rejected cancelled failed]) ? "error" : "warning")
    end

    column("Total") do |order|
      strong number_to_currency(order.total)
    end

    column("Entrega") do |order|
      truncate(order.display_shipping_address, length: 54)
    end

    column("Items") do |order|
      order.order_items.sum(:quantity)
    end

    actions defaults: true do |order|
      if order.paid?
        item "Enviar", mark_as_shipped_admin_order_path(order), method: :put, class: "member_link"
      elsif order.shipped?
        item "Completar", mark_as_completed_admin_order_path(order), method: :put, class: "member_link"
      end
    end
  end

  filter :user, label: "Cliente"
  filter :user_email, label: "Correo del cliente"
  filter :status, as: :select, collection: Order.statuses.keys, label: "Estado"
  filter :payment_status, as: :select, collection: [ "pending", "approved", "rejected", "cancelled", "in_process" ], label: "Estado de pago"
  filter :total, label: "Monto total"
  filter :created_at, label: "Fecha de creación", as: :date_range

  form do |f|
    f.inputs "Datos principales" do
      f.input :user, input_html: { disabled: true }
      f.input :status, as: :select, collection: Order.statuses.keys
      f.input :payment_status
      f.input :payment_id
      f.input :shipping_address
    end
    f.actions
  end

  show title: proc { |order| "Pedido ##{order.id.to_s.rjust(6, '0')}" } do
    columns do
      column do
        panel "Resumen del pedido" do
          attributes_table_for order do
            row("Cliente") { |record| record.user&.name || record.user&.email }
            row("Correo") { |record| record.user&.email }
            row("Estado") { |record| status_tag(record.status) }
            row("Pago") { |record| record.payment_status.presence || "sin confirmar" }
            row("ID de pago", &:payment_id)
            row("Total") { |record| number_to_currency(record.total) }
            row("Creado") { |record| l(record.created_at, format: :long) }
            row("Actualizado") { |record| l(record.updated_at, format: :long) }
          end
        end
      end

      column do
        panel "Entrega y operación" do
          attributes_table_for order do
            row("Dirección") { |record| simple_format(record.display_shipping_address) }
            row("Cantidad de items") { |record| record.order_items.sum(:quantity) }
            row("Reserva actual") { |record| record.pending? ? "Reservada" : "Procesada" }
          end
        end
      end
    end

    panel "Notas del pedido" do
      if order.notes.any?
        table_for order.notes do
          column("Tipo") { |note| note.note_type }
          column("Contenido", &:content)
          column("Fecha") { |note| l(note.created_at, format: :short) }
        end
      else
        para "No hay notas para este pedido."
      end
    end

    panel "Items del pedido" do
      table_for order.order_items.includes(:product) do
        column("Producto") { |item| link_to(item.product.title, admin_product_path(item.product)) }
        column("Cantidad", &:quantity)
        column("Precio unitario") { |item| number_to_currency(item.unit_price) }
        column("Subtotal") { |item| number_to_currency(item.unit_price * item.quantity) }
      end
    end
  end
end
