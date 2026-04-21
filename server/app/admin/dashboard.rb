# frozen_string_literal: true

ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: "Panel"

  content title: "Panel de control" do
    total_orders = Order.count
    paid_orders = Order.where(status: :paid).count
    pending_orders = Order.where(status: :pending).count
    monthly_revenue = Order.where(status: [ :paid, :shipped, :completed ])
                           .where(created_at: Time.current.beginning_of_month..Time.current.end_of_month)
                           .sum(:total)
    total_products = Product.count
    low_stock_products = Product.where("stock <= ?", 3).order(:stock, :title).limit(6)
    recent_orders = Order.includes(:user).order(created_at: :desc).limit(6)
    recent_users = User.order(created_at: :desc).limit(5)
    recent_reviews = Review.includes(:user).order(created_at: :desc).limit(5)
    pending_payment_orders = Order.includes(:user)
                                  .where(payment_status: [ nil, "", "pending", "in_process", "in_mediation" ])
                                  .order(created_at: :desc)
                                  .limit(5)

    div style: "display:grid; gap: 28px;" do
      div style: "padding: 30px; border-radius: 28px; background: linear-gradient(135deg, #111827, #1f2937 54%, #9f7aea 140%); color: #f9fafb; box-shadow: 0 24px 60px rgba(17,24,39,0.24);" do
        div style: "display:flex; flex-wrap:wrap; gap:24px; align-items:flex-end; justify-content:space-between;" do
          div do
            para "INSPIRATION STORE ADMIN", style: "margin:0 0 10px; font-size:11px; letter-spacing:0.34em; color:#cbd5e1;"
            h2 "Operación de tienda", style: "margin:0; font-size:40px; line-height:1; color:#ffffff;"
            para "Vista rápida de pedidos, stock, clientes y actividad reciente.", style: "margin:14px 0 0; max-width: 720px; color:#e5e7eb; font-size:15px; line-height:1.8;"
          end

          div style: "display:flex; flex-wrap:wrap; gap:12px;" do
            [
              { label: "Productos", path: "/admin/products", tone: "#3b82f6" },
              { label: "Pedidos", path: "/admin/orders", tone: "#14b8a6" },
              { label: "Clientes", path: "/admin/users", tone: "#8b5cf6" },
              { label: "Reseñas", path: "/admin/reviews", tone: "#f59e0b" }
            ].each do |item|
              a item[:label], href: item[:path], style: "display:inline-flex; align-items:center; justify-content:center; min-width:120px; padding:12px 16px; border-radius:999px; background: #{item[:tone]}; color:#fff; text-decoration:none; font-weight:700; font-size:12px; letter-spacing:0.12em; text-transform:uppercase;"
            end
          end
        end
      end

      div style: "display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:18px;" do
        [
          { label: "Pedidos totales", value: total_orders, note: "Histórico acumulado", tone: "#111827" },
          { label: "Pendientes", value: pending_orders, note: "Requieren seguimiento", tone: "#d97706" },
          { label: "Pagados", value: paid_orders, note: "Listos para operación", tone: "#059669" },
          { label: "Ingreso del mes", value: helpers.number_to_currency(monthly_revenue), note: "Pedidos cobrados este mes", tone: "#7c3aed" },
          { label: "Productos activos", value: total_products, note: "Catálogo disponible", tone: "#2563eb" }
        ].each do |card|
          div style: "padding: 22px; border-radius: 22px; background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 10px 30px rgba(15,23,42,0.06);" do
            para card[:label], style: "margin:0; font-size:11px; letter-spacing:0.24em; text-transform:uppercase; color:#6b7280;"
            div card[:value], style: "margin-top:12px; font-size:34px; font-weight:800; line-height:1; color: #{card[:tone]};"
            para card[:note], style: "margin:12px 0 0; font-size:14px; color:#4b5563; line-height:1.6;"
          end
        end
      end

      div style: "display:grid; grid-template-columns:2fr 1fr; gap:20px;" do
        div style: "display:grid; gap:20px;" do
          panel "Pedidos recientes" do
            if recent_orders.any?
              table_for recent_orders do
                column("Pedido") { |order| link_to "##{order.id.to_s.rjust(6, '0')}", admin_order_path(order) }
                column("Cliente") { |order| order.user&.name || order.user&.email || "Sin cliente" }
                column("Estado") { |order| status_tag order.status }
                column("Pago") { |order| order.payment_status.presence || "sin confirmar" }
                column("Total") { |order| helpers.number_to_currency(order.total) }
                column("Fecha") { |order| l(order.created_at, format: :short) }
              end
            else
              para "Aún no hay pedidos registrados."
            end
          end

          panel "Pagos por revisar" do
            if pending_payment_orders.any?
              table_for pending_payment_orders do
                column("Pedido") { |order| link_to "##{order.id}", admin_order_path(order) }
                column("Cliente") { |order| order.user&.email || "Sin correo" }
                column("Estado") { |order| status_tag(order.status) }
                column("Pago") { |order| order.payment_status.presence || "pendiente" }
                column("Dirección") { |order| truncate(order.shipping_address, length: 42) }
              end
            else
              para "No hay pagos pendientes de revisión en este momento."
            end
          end
        end

        div style: "display:grid; gap:20px;" do
          panel "Alertas de stock" do
            if low_stock_products.any?
              ul style: "padding-left:18px; margin:0;" do
                low_stock_products.each do |product|
                  li style: "margin-bottom:12px;" do
                    div do
                      strong link_to(product.title, admin_product_path(product))
                    end
                    span "Stock: #{product.stock}", style: "color:#b45309; font-weight:700;"
                  end
                end
              end
            else
              para "No hay productos con stock bajo."
            end
          end

          panel "Clientes recientes" do
            if recent_users.any?
              table_for recent_users do
                column("Nombre") { |user| link_to(user.name, admin_user_path(user)) }
                column("Correo", &:email)
                column("Alta") { |user| l(user.created_at, format: :short) }
              end
            else
              para "Aún no hay clientes registrados."
            end
          end

          panel "Últimas reseñas" do
            if recent_reviews.any?
              table_for recent_reviews do
                column("Cliente") { |review| review.user&.name || review.user&.email || "Sin usuario" }
                column("Puntaje", &:rating)
                column("Comentario") { |review| truncate(review.comment.to_s, length: 70) }
              end
            else
              para "Todavía no hay reseñas publicadas."
            end
          end
        end
      end

      panel "Accesos rápidos" do
        div style: "display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px;" do
          [
            { label: "Gestionar productos", subtitle: "Crear, editar y revisar stock", path: "/admin/products", tone: "#eff6ff", accent: "#2563eb" },
            { label: "Gestionar categorías", subtitle: "Orden del catálogo", path: "/admin/categories", tone: "#ecfdf5", accent: "#059669" },
            { label: "Ver pedidos", subtitle: "Pagos, envíos y estados", path: "/admin/orders", tone: "#f0fdfa", accent: "#0f766e" },
            { label: "Clientes", subtitle: "Perfiles y direcciones", path: "/admin/users", tone: "#faf5ff", accent: "#7c3aed" },
            { label: "Notas internas", subtitle: "Seguimiento y contexto", path: "/admin/notes", tone: "#fdf2f8", accent: "#db2777" },
            { label: "Direcciones", subtitle: "Normalización y revisión", path: "/admin/addresses", tone: "#f9fafb", accent: "#4b5563" }
          ].each do |item|
            a href: item[:path], style: "display:block; padding:18px; border-radius:20px; text-decoration:none; background: #{item[:tone]}; border:1px solid #e5e7eb;" do
              div item[:label], style: "font-size:15px; font-weight:800; color: #{item[:accent]};"
              para item[:subtitle], style: "margin:10px 0 0; font-size:13px; line-height:1.6; color:#4b5563;"
            end
          end
        end
      end
    end
  end
end
