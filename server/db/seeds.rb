# Create Categories
art = Category.create!(name: "Arte Moderno")
digital = Category.create!(name: "Arte Digital")
escultura = Category.create!(name: "Escultura")

# Create Admin User
admin = User.create!(
  name: "Administrador de la Galería",
  email: "admin@inspiration.com",
  password: "AdminPassword2024!",
  password_confirmation: "AdminPassword2024!",
  role: :admin
)

# Create Customer User
customer = User.create!(
  name: "Coleccionista de Prueba",
  email: "test@coleccionista.com",
  password: "UserPassword2024!",
  password_confirmation: "UserPassword2024!",
  role: :customer
)

# Create Products
Product.create!(
  title: "Esencia de Oro",
  description: "Una pieza única bañada en pan de oro de 24k que representa la dualidad humana.",
  price: 5500.00,
  stock: 1,
  category: escultura,
  image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600"
)

Product.create!(
  title: "Caos Estelar",
  description: "Explosión cromática en lienzo de gran formato. Captura la energía de una supernova.",
  price: 2800.00,
  stock: 3,
  category: art,
  image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600"
)

Product.create!(
  title: "Silencio Urbano",
  description: "Serie fotográfica limitada. El vacío de las metrópolis a las 4 AM.",
  price: 850.00,
  stock: 15,
  category: art,
  image: "https://images.unsplash.com/photo-1449156059530-9b41a96b4bf6?q=80&w=600"
)

Product.create!(
  title: "Fragmentos de Neón",
  description: "Algoritmo generativo que crea patrones infinitos de luz digital.",
  price: 450.00,
  stock: 100,
  category: digital,
  image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600"
)

Product.create!(
  title: "Océano de Ónix",
  description: "Escultura en piedra natural pulida con técnicas ancestrales.",
  price: 3200.00,
  stock: 2,
  category: escultura,
  image: "https://images.unsplash.com/photo-1544605963-3f1911467a9c?q=80&w=600"
)

puts "✅ Database seeded successfully!"
puts "Admin: admin@inspiration.com / AdminPassword2024!"
puts "Customer: test@coleccionista.com / UserPassword2024!"
AdminUser.create!(email: 'admin@example.com', password: 'password', password_confirmation: 'password') if Rails.env.development?