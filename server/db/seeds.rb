# Create Categories
art = Category.find_or_create_by!(name: "Arte Moderno")
digital = Category.find_or_create_by!(name: "Arte Digital")
escultura = Category.find_or_create_by!(name: "Escultura")

# Create Admin User
admin = User.find_or_create_by!(email: "noslenque931@gmail.com") do |user|
  user.name = "Administrador"
  user.password = "123456"
  user.password_confirmation = "123456"
  user.role = :admin
end

# Create Customer User
customer = User.find_or_create_by!(email: "test@coleccionista.com") do |user|
  user.name = "Coleccionista de Prueba"
  user.password = "UserPassword2024!"
  user.password_confirmation = "UserPassword2024!"
  user.role = :customer
end

# Create Products
Product.find_or_create_by!(title: "Esencia de Oro") do |product|
  product.description = "Una pieza única bañada en pan de oro de 24k que representa la dualidad humana."
  product.price = 5500.00
  product.stock = 1
  product.category = escultura
  product.image = "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600"
end

Product.find_or_create_by!(title: "Caos Estelar") do |product|
  product.description = "Explosión cromática en lienzo de gran formato. Captura la energía de una supernova."
  product.price = 2800.00
  product.stock = 3
  product.category = art
  product.image = "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600"
end

Product.find_or_create_by!(title: "Silencio Urbano") do |product|
  product.description = "Serie fotográfica limitada. El vacío de las metrópolis a las 4 AM."
  product.price = 850.00
  product.stock = 15
  product.category = art
  product.image = "https://images.unsplash.com/photo-1449156059530-9b41a96b4bf6?q=80&w=600"
end

Product.find_or_create_by!(title: "Fragmentos de Neón") do |product|
  product.description = "Algoritmo generativo que crea patrones infinitos de luz digital."
  product.price = 450.00
  product.stock = 100
  product.category = digital
  product.image = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600"
end

Product.find_or_create_by!(title: "Océano de Ónix") do |product|
  product.description = "Escultura en piedra natural pulida con técnicas ancestrales."
  product.price = 3200.00
  product.stock = 2
  product.category = escultura
  product.image = "https://images.unsplash.com/photo-1544605963-3f1911467a9c?q=80&w=600"
end

puts "✅ Database seeded successfully!"
puts "Admin: noslenque931@gmail.com / 123456"
puts "Customer: test@coleccionista.com / UserPassword2024!"
AdminUser.find_or_create_by!(email: 'noslenque931@gmail.com') do |user|
  user.password = "123456"
  user.password_confirmation = "123456"
end
