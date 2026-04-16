# 1. Crear Administradores PRIMERO
puts "Creating Admin users..."
AdminUser.find_or_create_by!(email: 'noslenque931@gmail.com') do |user|
  user.password = "123456"
  user.password_confirmation = "123456"
end

# 2. Crear Usuarios base
puts "Creating base users..."
User.find_or_create_by!(email: "noslenque931@gmail.com") do |user|
  user.name = "Administrador"
  user.password = "123456"
  user.password_confirmation = "123456"
  user.role = :admin
end

User.find_or_create_by!(email: "test@coleccionista.com") do |user|
  user.name = "Coleccionista de Prueba"
  user.password = "UserPassword2024!"
  user.password_confirmation = "UserPassword2024!"
  user.role = :customer
end

# 3. Crear Categorías
puts "Creating categories..."
art = Category.find_or_create_by!(name: "Arte Moderno")
digital = Category.find_or_create_by!(name: "Arte Digital")
escultura = Category.find_or_create_by!(name: "Escultura")

# 4. Crear Productos (de forma segura)
puts "Creating products..."
products_data = [
  { title: "Esencia de Oro", price: 5500.0, stock: 1, category: escultura, description: "Pieza única bañada en oro." },
  { title: "Caos Estelar", price: 2800.0, stock: 3, category: art, description: "Lienzo de gran formato." },
  { title: "Silencio Urbano", price: 850.0, stock: 15, category: art, description: "Serie fotográfica." }
]

products_data.each do |data|
  Product.find_or_create_by!(title: data[:title]) do |p|
    p.price = data[:price]
    p.stock = data[:stock]
    p.category = data[:category]
    p.description = data[:description]
  end
end

puts "✅ Database seeded successfully!"
