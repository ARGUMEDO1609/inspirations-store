# frozen_string_literal: true
ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: "Menú Principal"
  
  content title: "Menú Principal" do
    div class: "mobile-menu-container", style: "display: flex; flex-wrap: wrap; gap: 20px; padding: 20px; justify-content: center; align-items: center; min-height: 70vh;" do
      
      [
        { label: "📦 Productos", path: "/admin/products", color: "#3b82f6" },
        { label: "📁 Categorías", path: "/admin/categories", color: "#10b981" },
        { label: "⭐ Reseñas", path: "/admin/reviews", color: "#f59e0b" },
        { label: "📍 Direcciones", path: "/admin/addresses", color: "#6b7280" },
        { label: "📝 Notas", path: "/admin/notes", color: "#ec4899" },
        { label: "👤 Clientes", path: "/admin/users", color: "#8b5cf6" },
        { label: "🔐 Admins", path: "/admin/admin_users", color: "#ef4444" }
      ].each do |item|
        a href: item[:path], style: "text-decoration: none; color: white; width: 160px; height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #{item[:color]}; border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); font-size: 1.4rem; font-weight: bold; text-align: center; padding: 15px;" do
          span item[:label]
        end
      end
    end
  end # content
end
