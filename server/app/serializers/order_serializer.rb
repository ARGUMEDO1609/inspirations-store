class OrderSerializer
  include JSONAPI::Serializer

  attributes :id, :reference, :status, :payment_status, :payment_method, :total, :shipping_address, :created_at, :updated_at

  attribute :order_items do |order|
    order.order_items.map do |item|
      {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        variant: item.variant ? {
          id: item.variant.id,
          name: item.variant.name,
          variant_type: item.variant.variant_type
        } : nil
      }
    end
  end
end
