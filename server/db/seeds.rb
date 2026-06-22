# frozen_string_literal: true

# Inspiration Store — datos de demostración.
# Prices are in Colombian pesos (COP). Idempotent: safe to run repeatedly.
# Set SEED_IMAGES=false to skip downloading product/category images.

require "open-uri"

# Active Storage URL helpers (used by serializers during model broadcasts) need a
# host outside of a request cycle.
Rails.application.routes.default_url_options[:host] ||= ENV.fetch("BACKEND_HOST", "localhost:3000")

SEED_IMAGES = ENV.fetch("SEED_IMAGES", "true") == "true"

# Attach a remote image (Lorem Picsum) to an Active Storage attachment.
# Failures (offline, timeout) are non-fatal so seeding still completes.
def attach_seed_image(record, slug, width: 900, height: 900)
  return unless SEED_IMAGES
  return if record.image.attached?

  url = "https://picsum.photos/seed/#{slug}/#{width}/#{height}"
  file = URI.parse(url).open(open_timeout: 10, read_timeout: 25)
  record.image.attach(io: file, filename: "#{slug}.jpg", content_type: "image/jpeg")
  print "."
rescue => e
  puts "\n  ⚠ imagen omitida para '#{slug}' (#{e.class}: #{e.message})"
end

def cop(amount)
  amount # decimal column; COP is a whole-number currency
end

# ─────────────────────────────────────────────────────────────────────────────
# 1. Administradores
# ─────────────────────────────────────────────────────────────────────────────
puts "Creating admin users..."
[
  { email: "noslenque931@gmail.com", password: "123456" },
  { email: "curaduria@inspirationstore.co", password: "Admin2024!" }
].each do |attrs|
  AdminUser.find_or_create_by!(email: attrs[:email]) do |u|
    u.password = attrs[:password]
    u.password_confirmation = attrs[:password]
  end
end

# ─────────────────────────────────────────────────────────────────────────────
# 2. Usuarios (1 admin de API + clientes colombianos)
# ─────────────────────────────────────────────────────────────────────────────
puts "Creating users..."

users_data = [
  { name: "Administrador", email: "noslenque931@gmail.com", password: "123456", role: :admin,
    phone: "+57 320 111 2233", address: { line: "Calle 93 #11-27, Oficina 502", city: "Bogotá", state: "Cundinamarca", zip: "110221" } },
  { name: "Coleccionista de Prueba", email: "test@coleccionista.com", password: "UserPassword2024!", role: :customer,
    phone: "+57 300 555 8899", address: { line: "Carrera 43A #1-50, Torre Norte Apto 1203", city: "Medellín", state: "Antioquia", zip: "050021" } },
  { name: "Valentina Ríos", email: "valentina.rios@example.co", password: "Cliente2024!", role: :customer,
    phone: "+57 311 204 7766", address: { line: "Carrera 70 #45-12", city: "Cali", state: "Valle del Cauca", zip: "760042" } },
  { name: "Santiago Gómez", email: "santiago.gomez@example.co", password: "Cliente2024!", role: :customer,
    phone: "+57 314 880 3321", address: { line: "Calle 72 #10-34, Apto 801", city: "Bogotá", state: "Cundinamarca", zip: "110231" } },
  { name: "Mariana López", email: "mariana.lopez@example.co", password: "Cliente2024!", role: :customer,
    phone: "+57 318 442 1190", address: { line: "Carrera 53 #79-220", city: "Barranquilla", state: "Atlántico", zip: "080020" } },
  { name: "Andrés Castaño", email: "andres.castano@example.co", password: "Cliente2024!", role: :customer,
    phone: "+57 301 667 5410", address: { line: "Calle del Arsenal #8-15, Getsemaní", city: "Cartagena", state: "Bolívar", zip: "130001" } },
  { name: "Camila Torres", email: "camila.torres@example.co", password: "Cliente2024!", role: :customer,
    phone: "+57 313 559 2048", address: { line: "Carrera 27 #36-44", city: "Bucaramanga", state: "Santander", zip: "680003" } },
  { name: "Sebastián Patiño", email: "sebastian.patino@example.co", password: "Cliente2024!", role: :customer,
    phone: "+57 312 770 9912", address: { line: "Carrera 35 #8A-23, Provenza", city: "Medellín", state: "Antioquia", zip: "050022" } }
]

users = {}
users_data.each do |data|
  user = User.find_or_create_by!(email: data[:email]) do |u|
    u.name = data[:name]
    u.role = data[:role]
    u.phone = data[:phone]
    u.password = data[:password]
    u.password_confirmation = data[:password]
  end

  addr = data[:address]
  user.addresses.find_or_create_by!(address_type: :home) do |a|
    a.address_line_1 = addr[:line]
    a.city = addr[:city]
    a.state = addr[:state]
    a.zip_code = addr[:zip]
    a.country = "Colombia"
  end

  users[data[:email]] = user
end

# ─────────────────────────────────────────────────────────────────────────────
# 3. Categorías (con imagen)
# ─────────────────────────────────────────────────────────────────────────────
puts "Creating categories..."

categories_data = [
  { name: "Arte Moderno", description: "Piezas contemporáneas de gran formato y carácter propio." },
  { name: "Arte Digital", description: "Ediciones y obras nativas digitales, impresas en fine art." },
  { name: "Escultura", description: "Volumen, materia y forma: piezas únicas en bronce, madera y resina." },
  { name: "Fotografía", description: "Series de autor en impresión de archivo y tiraje limitado." },
  { name: "Pintura al Óleo", description: "Lienzos originales con técnica clásica y mirada actual." },
  { name: "Cerámica Artesanal", description: "Gres y porcelana hechos a mano, funcionales y decorativos." },
  { name: "Textiles y Tapices", description: "Tejidos, tapices y fibras naturales de talleres colombianos." },
  { name: "Joyería de Autor", description: "Piezas en plata, latón y piedras, en ediciones cortas." }
]

categories = {}
categories_data.each do |data|
  category = Category.find_or_create_by!(name: data[:name]) do |c|
    c.description = data[:description]
  end
  attach_seed_image(category, "#{category.name.parameterize}-cat", width: 1200, height: 600)
  categories[data[:name]] = category
end
puts ""

# ─────────────────────────────────────────────────────────────────────────────
# 4. Productos (precios en COP, con imagen y variantes opcionales)
# ─────────────────────────────────────────────────────────────────────────────
puts "Creating products..."

# sizes/colors: arrays of [name, stock]; variant_type inferred by key.
products_data = [
  # Arte Moderno
  { title: "Caos Estelar", category: "Arte Moderno", price: cop(1_800_000), stock: 3,
    description: "Lienzo de gran formato con composición abstracta en acrílico." },
  { title: "Geometría del Silencio", category: "Arte Moderno", price: cop(980_000), stock: 5,
    description: "Estudio minimalista en tonos neutros sobre tela de lino." },
  { title: "Fragmento Urbano", category: "Arte Moderno", price: cop(620_000), stock: 8,
    description: "Collage contemporáneo de técnica mixta enmarcado." },

  # Arte Digital
  { title: "Sueño Sintético", category: "Arte Digital", price: cop(450_000), stock: 12,
    description: "Edición digital limitada impresa en papel fine art 300g.",
    sizes: [ [ "Pequeño 30x30", 12 ], [ "Mediano 50x50", 8 ], [ "Grande 70x70", 4 ] ] },
  { title: "Ruido Cromático", category: "Arte Digital", price: cop(280_000), stock: 20,
    description: "Obra generativa de paleta vibrante, tiraje numerado.",
    sizes: [ [ "Pequeño 30x30", 20 ], [ "Mediano 50x50", 10 ] ] },
  { title: "Horizonte de Datos", category: "Arte Digital", price: cop(150_000), stock: 30,
    description: "Lámina digital de líneas y degradados, lista para enmarcar." },

  # Escultura
  { title: "Esencia de Oro", category: "Escultura", price: cop(4_200_000), stock: 1,
    description: "Pieza única en resina bañada en pan de oro sobre base de mármol." },
  { title: "Raíz de Bronce", category: "Escultura", price: cop(1_500_000), stock: 2,
    description: "Escultura figurativa en bronce fundido con pátina artesanal." },
  { title: "Equilibrio", category: "Escultura", price: cop(850_000), stock: 4,
    description: "Forma orgánica tallada en madera de nogal." },

  # Fotografía
  { title: "Silencio Urbano", category: "Fotografía", price: cop(320_000), stock: 15,
    description: "Serie fotográfica en blanco y negro, impresión de archivo.",
    sizes: [ [ "A3", 15 ], [ "A2", 9 ], [ "A1", 5 ] ] },
  { title: "Niebla de Páramo", category: "Fotografía", price: cop(240_000), stock: 18,
    description: "Paisaje andino capturado al amanecer, tiraje limitado.",
    sizes: [ [ "A3", 18 ], [ "A2", 8 ] ] },
  { title: "Retrato de Barrio", category: "Fotografía", price: cop(180_000), stock: 22,
    description: "Fotografía documental de calle, edición numerada." },

  # Pintura al Óleo
  { title: "Jardín Interno", category: "Pintura al Óleo", price: cop(3_800_000), stock: 1,
    description: "Óleo original sobre lienzo, gran formato, marco de autor." },
  { title: "Tarde de Provincia", category: "Pintura al Óleo", price: cop(2_500_000), stock: 2,
    description: "Paisaje costumbrista en óleo con espátula." },
  { title: "Bodegón de Frutas", category: "Pintura al Óleo", price: cop(1_200_000), stock: 3,
    description: "Naturaleza muerta de técnica clásica sobre tabla." },

  # Cerámica Artesanal
  { title: "Vasija Terracota", category: "Cerámica Artesanal", price: cop(320_000), stock: 10,
    description: "Vasija de gres torneada a mano, esmalte mate.",
    colors: [ [ "Terracota", 6 ], [ "Arena", 4 ] ] },
  { title: "Set de Tazas Andinas", category: "Cerámica Artesanal", price: cop(160_000), stock: 16,
    description: "Juego de 4 tazas en porcelana con motivos geométricos.",
    colors: [ [ "Blanco", 8 ], [ "Azul Índigo", 8 ] ] },
  { title: "Plato Decorativo Sol", category: "Cerámica Artesanal", price: cop(95_000), stock: 25,
    description: "Plato decorativo pintado a mano, pieza funcional." },

  # Textiles y Tapices
  { title: "Tapiz Telar Mayor", category: "Textiles y Tapices", price: cop(540_000), stock: 6,
    description: "Tapiz tejido en telar con lana virgen teñida naturalmente." },
  { title: "Manta Wayúu", category: "Textiles y Tapices", price: cop(380_000), stock: 9,
    description: "Tejido tradicional wayúu, hecho a mano en La Guajira.",
    colors: [ [ "Multicolor", 5 ], [ "Tierra", 4 ] ] },
  { title: "Cojín Geométrico", category: "Textiles y Tapices", price: cop(220_000), stock: 14,
    description: "Funda de cojín en algodón con bordado geométrico.",
    sizes: [ [ "40x40", 14 ], [ "50x50", 7 ] ] },

  # Joyería de Autor
  { title: "Anillo Cordillera", category: "Joyería de Autor", price: cop(1_200_000), stock: 4,
    description: "Anillo en plata 925 con esmeralda colombiana.",
    sizes: [ [ "6", 2 ], [ "7", 1 ], [ "8", 1 ] ] },
  { title: "Aretes Hoja de Latón", category: "Joyería de Autor", price: cop(650_000), stock: 7,
    description: "Aretes esculpidos en latón con baño de oro." },
  { title: "Collar Semilla", category: "Joyería de Autor", price: cop(280_000), stock: 12,
    description: "Collar artesanal con semillas y cuentas de plata." }
]

products = {}
products_data.each do |data|
  product = Product.find_or_create_by!(title: data[:title]) do |p|
    p.description = data[:description]
    p.price = data[:price]
    p.stock = data[:stock]
    p.category = categories.fetch(data[:category])
  end

  # Variants (idempotent by name within the product).
  Array(data[:sizes]).each do |name, stock|
    product.variants.find_or_create_by!(name: name, variant_type: "size") { |v| v.stock = stock }
  end
  Array(data[:colors]).each do |name, stock|
    product.variants.find_or_create_by!(name: name, variant_type: "color") { |v| v.stock = stock }
  end

  attach_seed_image(product, data[:title].parameterize)
  products[data[:title]] = product
end
puts ""

# ─────────────────────────────────────────────────────────────────────────────
# 5. Pedidos de ejemplo (varios estados) — solo si no existen
# ─────────────────────────────────────────────────────────────────────────────
if Order.count.zero?
  puts "Creating sample orders..."

  # [customer_email, status, payment_method, payment_status, [[product_title, qty], ...]]
  orders_blueprint = [
    [ "test@coleccionista.com", :completed, :card, "approved",
      [ [ "Silencio Urbano", 2 ], [ "Horizonte de Datos", 1 ] ] ],
    [ "valentina.rios@example.co", :paid, :card, "approved",
      [ [ "Anillo Cordillera", 1 ] ] ],
    [ "santiago.gomez@example.co", :shipped, :cash_on_delivery, "cash_on_delivery",
      [ [ "Tapiz Telar Mayor", 1 ], [ "Cojín Geométrico", 2 ] ] ],
    [ "mariana.lopez@example.co", :pending, :card, "pending",
      [ [ "Sueño Sintético", 1 ] ] ],
    [ "andres.castano@example.co", :paid, :card, "approved",
      [ [ "Raíz de Bronce", 1 ] ] ],
    [ "camila.torres@example.co", :cancelled, :card, "rejected",
      [ [ "Bodegón de Frutas", 1 ] ] ],
    [ "sebastian.patino@example.co", :completed, :cash_on_delivery, "cash_on_delivery",
      [ [ "Set de Tazas Andinas", 1 ], [ "Plato Decorativo Sol", 3 ] ] ],
    [ "test@coleccionista.com", :paid, :card, "approved",
      [ [ "Manta Wayúu", 1 ], [ "Collar Semilla", 1 ] ] ]
  ]

  orders_blueprint.each do |email, status, method, payment_status, line_items|
    user = users.fetch(email)
    shipping = user.primary_address_record&.legacy_text.presence || "Dirección de envío"

    built_items = line_items.map do |title, qty|
      product = products.fetch(title)
      { product: product, quantity: qty, unit_price: product.price }
    end
    total = built_items.sum { |i| i[:unit_price] * i[:quantity] }

    order = user.orders.create!(
      shipping_address: shipping,
      payment_method: method,
      status: status,
      payment_status: payment_status,
      total: total
    )

    built_items.each do |item|
      order.order_items.create!(
        product: item[:product],
        quantity: item[:quantity],
        unit_price: item[:unit_price]
      )
    end
  end
end

# ─────────────────────────────────────────────────────────────────────────────
# 6. Reseñas — solo si no existen
# ─────────────────────────────────────────────────────────────────────────────
if Review.count.zero?
  puts "Creating reviews..."

  reviews_blueprint = [
    [ "valentina.rios@example.co", "Silencio Urbano", 5, "Impresión impecable y un encuadre que enamora. Llegó muy bien protegida." ],
    [ "santiago.gomez@example.co", "Anillo Cordillera", 5, "La esmeralda es preciosa y el acabado en plata se siente premium." ],
    [ "mariana.lopez@example.co", "Tapiz Telar Mayor", 4, "Hermoso trabajo de telar, aunque tardó un poco más de lo esperado." ],
    [ "andres.castano@example.co", "Raíz de Bronce", 5, "Una pieza con muchísimo carácter, la pátina es espectacular." ],
    [ "camila.torres@example.co", "Set de Tazas Andinas", 4, "Muy bonitas y resistentes, ideales para el café de la mañana." ],
    [ "sebastian.patino@example.co", "Manta Wayúu", 5, "Tejido auténtico y colores vivos. Apoyar el trabajo artesanal vale la pena." ],
    [ "test@coleccionista.com", "Caos Estelar", 5, "Domina la sala por completo, los colores son aún mejores en persona." ],
    [ "valentina.rios@example.co", "Cojín Geométrico", 4, "Buen acabado del bordado y tela suave. Repetiría la compra." ]
  ]

  reviews_blueprint.each do |email, product_title, rating, comment|
    user = users.fetch(email)
    product = products.fetch(product_title)
    Review.find_or_create_by!(user: user, reviewable: product) do |r|
      r.rating = rating
      r.comment = comment
    end
  end
end

# ─────────────────────────────────────────────────────────────────────────────
puts "\n✅ Database seeded successfully!"
puts "   Admins:     #{AdminUser.count}"
puts "   Users:      #{User.count} (#{User.customer.count} clientes)"
puts "   Categories: #{Category.count}"
puts "   Products:   #{Product.count}  |  Variants: #{Variant.count}"
puts "   Orders:     #{Order.count}  |  Order items: #{OrderItem.count}"
puts "   Reviews:    #{Review.count}"
puts "   Images:     #{ActiveStorage::Attachment.count} attached" if SEED_IMAGES
