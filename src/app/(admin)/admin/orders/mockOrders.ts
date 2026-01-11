import { Order, ShippingAddress } from '@/services/types'

export interface StatusHistoryItem {
  status: Order['status']
  changed_at: string
  changed_by?: string
  note?: string
}

export interface AdminOrder extends Order {
  customer_name: string
  customer_email: string
  customer_phone?: string
  order_number: string
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  tracking_number?: string
  notes?: string
  status_history: StatusHistoryItem[]
}

export const mockOrders: AdminOrder[] = [
  {
    id: '1',
    order_number: 'ORD-2026-0123',
    customer_name: 'John Doe',
    customer_email: 'john.doe@example.com',
    customer_phone: '+260 97 123 4567',
    user_id: 'user_1',
    status: 'pending',
    payment_status: 'pending',
    payment_method: 'Mobile Money (MTN)',
    total_zmw: 450,
    created_at: '2026-01-11T10:30:00Z',
    shipping_address: {
      first_name: 'John',
      last_name: 'Doe',
      address: '123 Kabulonga Road',
      area: 'Kabulonga',
      city: 'Lusaka',
      phone: '+260 97 123 4567',
    },
    items: [
      {
        id: 'item_1',
        order_id: '1',
        product_id: 'p1',
        quantity: 2,
        price_at_purchase: 225,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-11T10:30:00Z', changed_by: 'System' }
    ],
    notes: 'Customer requested gift wrapping'
  },
  {
    id: '2',
    order_number: 'ORD-2026-0122',
    customer_name: 'Sarah Smith',
    customer_email: 'sarah.smith@example.com',
    customer_phone: '+260 96 234 5678',
    user_id: 'user_2',
    status: 'delivered',
    payment_status: 'completed',
    payment_method: 'Visa Card',
    total_zmw: 1200,
    created_at: '2026-01-09T14:20:00Z',
    tracking_number: 'TRK-ZM-789456',
    shipping_address: {
      first_name: 'Sarah',
      last_name: 'Smith',
      address: '45 Great East Road',
      area: 'Roma',
      city: 'Lusaka',
      phone: '+260 96 234 5678',
    },
    items: [
      {
        id: 'item_2',
        order_id: '2',
        product_id: 'p2',
        quantity: 1,
        price_at_purchase: 1200,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-09T14:20:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2026-01-09T14:25:00Z', changed_by: 'admin@luxury.com' },
      { status: 'shipped', changed_at: '2026-01-10T09:00:00Z', changed_by: 'admin@luxury.com', note: 'Shipped via Fastway Couriers' },
      { status: 'delivered', changed_at: '2026-01-11T11:30:00Z', changed_by: 'System' },
    ]
  },
  {
    id: '3',
    order_number: 'ORD-2026-0121',
    customer_name: 'Michael Banda',
    customer_email: 'michael.banda@example.com',
    customer_phone: '+260 95 345 6789',
    user_id: 'user_3',
    status: 'shipped',
    payment_status: 'completed',
    payment_method: 'Mobile Money (Airtel)',
    total_zmw: 785,
    created_at: '2026-01-08T16:45:00Z',
    tracking_number: 'TRK-ZM-456123',
    shipping_address: {
      first_name: 'Michael',
      last_name: 'Banda',
      address: '12 Independence Avenue',
      area: 'Woodlands',
      city: 'Lusaka',
      phone: '+260 95 345 6789',
    },
    items: [
      {
        id: 'item_3',
        order_id: '3',
        product_id: 'p3',
        quantity: 3,
        price_at_purchase: 261.67,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-08T16:45:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2026-01-08T16:50:00Z', changed_by: 'admin@luxury.com' },
      { status: 'shipped', changed_at: '2026-01-09T08:15:00Z', changed_by: 'admin@luxury.com' },
    ]
  },
  {
    id: '4',
    order_number: 'ORD-2026-0120',
    customer_name: 'Grace Mwale',
    customer_email: 'grace.mwale@example.com',
    customer_phone: '+260 97 456 7890',
    user_id: 'user_4',
    status: 'paid',
    payment_status: 'completed',
    payment_method: 'Bank Transfer',
    total_zmw: 2450,
    created_at: '2026-01-07T09:30:00Z',
    shipping_address: {
      first_name: 'Grace',
      last_name: 'Mwale',
      address: '78 Cairo Road',
      area: 'City Centre',
      city: 'Lusaka',
      phone: '+260 97 456 7890',
    },
    items: [
      {
        id: 'item_4',
        order_id: '4',
        product_id: 'p4',
        quantity: 1,
        price_at_purchase: 2450,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-07T09:30:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2026-01-07T10:15:00Z', changed_by: 'admin@luxury.com', note: 'Payment verified' },
    ],
    notes: 'High-value order - handle with care'
  },
  {
    id: '5',
    order_number: 'ORD-2026-0119',
    customer_name: 'David Phiri',
    customer_email: 'david.phiri@example.com',
    customer_phone: '+260 96 567 8901',
    user_id: 'user_5',
    status: 'cancelled',
    payment_status: 'refunded',
    payment_method: 'Mobile Money (MTN)',
    total_zmw: 320,
    created_at: '2026-01-06T13:00:00Z',
    shipping_address: {
      first_name: 'David',
      last_name: 'Phiri',
      address: '34 Los Angeles Boulevard',
      area: 'Chelston',
      city: 'Lusaka',
      phone: '+260 96 567 8901',
    },
    items: [
      {
        id: 'item_5',
        order_id: '5',
        product_id: 'p5',
        quantity: 1,
        price_at_purchase: 320,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-06T13:00:00Z', changed_by: 'System' },
      { status: 'cancelled', changed_at: '2026-01-06T15:30:00Z', changed_by: 'admin@luxury.com', note: 'Customer requested cancellation - out of stock' },
    ],
    notes: 'Customer requested cancellation due to delay'
  },
  {
    id: '6',
    order_number: 'ORD-2026-0118',
    customer_name: 'Patricia Tembo',
    customer_email: 'patricia.tembo@example.com',
    customer_phone: '+260 97 678 9012',
    user_id: 'user_6',
    status: 'delivered',
    payment_status: 'completed',
    payment_method: 'Cash on Delivery',
    total_zmw: 890,
    created_at: '2026-01-05T11:20:00Z',
    tracking_number: 'TRK-ZM-321654',
    shipping_address: {
      first_name: 'Patricia',
      last_name: 'Tembo',
      address: '56 Nationalist Road',
      area: 'Olympia',
      city: 'Lusaka',
      phone: '+260 97 678 9012',
    },
    items: [
      {
        id: 'item_6',
        order_id: '6',
        product_id: 'p6',
        quantity: 2,
        price_at_purchase: 445,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-05T11:20:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2026-01-05T11:25:00Z', changed_by: 'admin@luxury.com' },
      { status: 'shipped', changed_at: '2026-01-06T08:00:00Z', changed_by: 'admin@luxury.com' },
      { status: 'delivered', changed_at: '2026-01-07T14:00:00Z', changed_by: 'System' },
    ]
  },
  {
    id: '7',
    order_number: 'ORD-2026-0117',
    customer_name: 'James Zulu',
    customer_email: 'james.zulu@example.com',
    customer_phone: '+260 95 789 0123',
    user_id: 'user_7',
    status: 'returned',
    payment_status: 'refunded',
    payment_method: 'Visa Card',
    total_zmw: 1560,
    created_at: '2026-01-04T15:30:00Z',
    tracking_number: 'TRK-ZM-987321',
    shipping_address: {
      first_name: 'James',
      last_name: 'Zulu',
      address: '23 Church Road',
      area: 'Rhodes Park',
      city: 'Lusaka',
      phone: '+260 95 789 0123',
    },
    items: [
      {
        id: 'item_7',
        order_id: '7',
        product_id: 'p7',
        quantity: 1,
        price_at_purchase: 1560,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-04T15:30:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2026-01-04T15:35:00Z', changed_by: 'admin@luxury.com' },
      { status: 'shipped', changed_at: '2026-01-05T09:00:00Z', changed_by: 'admin@luxury.com' },
      { status: 'delivered', changed_at: '2026-01-06T16:00:00Z', changed_by: 'System' },
      { status: 'returned', changed_at: '2026-01-08T10:00:00Z', changed_by: 'admin@luxury.com', note: 'Wrong size - customer returned' },
    ],
    notes: 'Return processed - wrong size delivered'
  },
  {
    id: '8',
    order_number: 'ORD-2026-0116',
    customer_name: 'Chanda Kabwe',
    customer_email: 'chanda.kabwe@example.com',
    customer_phone: '+260 96 890 1234',
    user_id: 'user_8',
    status: 'pending',
    payment_status: 'pending',
    payment_method: 'Mobile Money (Airtel)',
    total_zmw: 675,
    created_at: '2026-01-11T08:15:00Z',
    shipping_address: {
      first_name: 'Chanda',
      last_name: 'Kabwe',
      address: '89 Twin Palms Road',
      area: 'Kabulonga',
      city: 'Lusaka',
      phone: '+260 96 890 1234',
    },
    items: [
      {
        id: 'item_8',
        order_id: '8',
        product_id: 'p8',
        quantity: 3,
        price_at_purchase: 225,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-11T08:15:00Z', changed_by: 'System' },
    ],
    notes: 'Awaiting payment confirmation'
  },
  {
    id: '9',
    order_number: 'ORD-2026-0115',
    customer_name: 'Elizabeth Mulenga',
    customer_email: 'elizabeth.mulenga@example.com',
    customer_phone: '+260 97 901 2345',
    user_id: 'user_9',
    status: 'shipped',
    payment_status: 'completed',
    payment_method: 'Mastercard',
    total_zmw: 3200,
    created_at: '2026-01-03T10:00:00Z',
    tracking_number: 'TRK-ZM-654987',
    shipping_address: {
      first_name: 'Elizabeth',
      last_name: 'Mulenga',
      address: '15 Leopards Hill Road',
      area: 'Leopards Hill',
      city: 'Lusaka',
      phone: '+260 97 901 2345',
    },
    items: [
      {
        id: 'item_9a',
        order_id: '9',
        product_id: 'p9',
        quantity: 2,
        price_at_purchase: 1200,
      },
      {
        id: 'item_9b',
        order_id: '9',
        product_id: 'p10',
        quantity: 1,
        price_at_purchase: 800,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-03T10:00:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2026-01-03T10:05:00Z', changed_by: 'admin@luxury.com' },
      { status: 'shipped', changed_at: '2026-01-04T08:30:00Z', changed_by: 'admin@luxury.com' },
    ],
    notes: 'Premium customer - expedited shipping'
  },
  {
    id: '10',
    order_number: 'ORD-2026-0114',
    customer_name: 'Andrew Chileshe',
    customer_email: 'andrew.chileshe@example.com',
    customer_phone: '+260 95 012 3456',
    user_id: 'user_10',
    status: 'paid',
    payment_status: 'completed',
    payment_method: 'Mobile Money (MTN)',
    total_zmw: 540,
    created_at: '2026-01-10T14:45:00Z',
    shipping_address: {
      first_name: 'Andrew',
      last_name: 'Chileshe',
      address: '67 Addis Ababa Drive',
      area: 'Meanwood',
      city: 'Lusaka',
      phone: '+260 95 012 3456',
    },
    items: [
      {
        id: 'item_10',
        order_id: '10',
        product_id: 'p11',
        quantity: 2,
        price_at_purchase: 270,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-10T14:45:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2026-01-10T15:00:00Z', changed_by: 'admin@luxury.com' },
    ]
  },
  {
    id: '11',
    order_number: 'ORD-2026-0113',
    customer_name: 'Mary Lungu',
    customer_email: 'mary.lungu@example.com',
    customer_phone: '+260 96 123 4567',
    user_id: 'user_11',
    status: 'delivered',
    payment_status: 'completed',
    payment_method: 'Bank Transfer',
    total_zmw: 1890,
    created_at: '2026-01-02T09:20:00Z',
    tracking_number: 'TRK-ZM-159753',
    shipping_address: {
      first_name: 'Mary',
      last_name: 'Lungu',
      address: '42 Katima Mulilo Road',
      area: 'Avondale',
      city: 'Lusaka',
      phone: '+260 96 123 4567',
    },
    items: [
      {
        id: 'item_11',
        order_id: '11',
        product_id: 'p12',
        quantity: 1,
        price_at_purchase: 1890,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-02T09:20:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2026-01-02T11:00:00Z', changed_by: 'admin@luxury.com' },
      { status: 'shipped', changed_at: '2026-01-03T08:00:00Z', changed_by: 'admin@luxury.com' },
      { status: 'delivered', changed_at: '2026-01-04T15:30:00Z', changed_by: 'System' },
    ]
  },
  {
    id: '12',
    order_number: 'ORD-2026-0112',
    customer_name: 'Peter Mwanza',
    customer_email: 'peter.mwanza@example.com',
    customer_phone: '+260 97 234 5678',
    user_id: 'user_12',
    status: 'pending',
    payment_status: 'failed',
    payment_method: 'Visa Card',
    total_zmw: 425,
    created_at: '2026-01-11T12:00:00Z',
    shipping_address: {
      first_name: 'Peter',
      last_name: 'Mwanza',
      address: '28 Kudu Road',
      area: 'Longacres',
      city: 'Lusaka',
      phone: '+260 97 234 5678',
    },
    items: [
      {
        id: 'item_12',
        order_id: '12',
        product_id: 'p13',
        quantity: 1,
        price_at_purchase: 425,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-11T12:00:00Z', changed_by: 'System' },
    ],
    notes: 'Payment declined - insufficient funds. Customer notified.'
  },
  {
    id: '13',
    order_number: 'ORD-2026-0111',
    customer_name: 'Ruth Sakala',
    customer_email: 'ruth.sakala@example.com',
    customer_phone: '+260 95 345 6789',
    user_id: 'user_13',
    status: 'shipped',
    payment_status: 'completed',
    payment_method: 'Mobile Money (Airtel)',
    total_zmw: 1125,
    created_at: '2026-01-06T16:30:00Z',
    tracking_number: 'TRK-ZM-753951',
    shipping_address: {
      first_name: 'Ruth',
      last_name: 'Sakala',
      address: '91 Munyati Road',
      area: 'Makeni',
      city: 'Lusaka',
      phone: '+260 95 345 6789',
    },
    items: [
      {
        id: 'item_13a',
        order_id: '13',
        product_id: 'p14',
        quantity: 3,
        price_at_purchase: 375,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-06T16:30:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2026-01-06T16:45:00Z', changed_by: 'admin@luxury.com' },
      { status: 'shipped', changed_at: '2026-01-07T09:00:00Z', changed_by: 'admin@luxury.com' },
    ]
  },
  {
    id: '14',
    order_number: 'ORD-2026-0110',
    customer_name: 'Daniel Mutale',
    customer_email: 'daniel.mutale@example.com',
    customer_phone: '+260 96 456 7890',
    user_id: 'user_14',
    status: 'delivered',
    payment_status: 'completed',
    payment_method: 'Cash on Delivery',
    total_zmw: 765,
    created_at: '2025-12-30T10:15:00Z',
    tracking_number: 'TRK-ZM-357159',
    shipping_address: {
      first_name: 'Daniel',
      last_name: 'Mutale',
      address: '14 Zambezi Road',
      area: 'Sunningdale',
      city: 'Lusaka',
      phone: '+260 96 456 7890',
    },
    items: [
      {
        id: 'item_14',
        order_id: '14',
        product_id: 'p15',
        quantity: 1,
        price_at_purchase: 765,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2025-12-30T10:15:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2025-12-30T10:20:00Z', changed_by: 'admin@luxury.com' },
      { status: 'shipped', changed_at: '2025-12-31T08:00:00Z', changed_by: 'admin@luxury.com' },
      { status: 'delivered', changed_at: '2026-01-02T13:00:00Z', changed_by: 'System' },
    ]
  },
  {
    id: '15',
    order_number: 'ORD-2026-0109',
    customer_name: 'Joyce Mwape',
    customer_email: 'joyce.mwape@example.com',
    customer_phone: '+260 97 567 8901',
    user_id: 'user_15',
    status: 'paid',
    payment_status: 'completed',
    payment_method: 'Mastercard',
    total_zmw: 2890,
    created_at: '2026-01-09T13:30:00Z',
    shipping_address: {
      first_name: 'Joyce',
      last_name: 'Mwape',
      address: '77 Chindo Road',
      area: 'Garden House',
      city: 'Lusaka',
      phone: '+260 97 567 8901',
    },
    items: [
      {
        id: 'item_15a',
        order_id: '15',
        product_id: 'p16',
        quantity: 1,
        price_at_purchase: 1850,
      },
      {
        id: 'item_15b',
        order_id: '15',
        product_id: 'p17',
        quantity: 2,
        price_at_purchase: 520,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-09T13:30:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2026-01-09T13:40:00Z', changed_by: 'admin@luxury.com' },
    ],
    notes: 'VIP customer - priority processing'
  },
  {
    id: '16',
    order_number: 'ORD-2026-0108',
    customer_name: 'Kenneth Nkole',
    customer_email: 'kenneth.nkole@example.com',
    customer_phone: '+260 95 678 9012',
    user_id: 'user_16',
    status: 'delivered',
    payment_status: 'completed',
    payment_method: 'Mobile Money (MTN)',
    total_zmw: 995,
    created_at: '2025-12-28T11:00:00Z',
    tracking_number: 'TRK-ZM-951357',
    shipping_address: {
      first_name: 'Kenneth',
      last_name: 'Nkole',
      address: '33 Mutende Road',
      area: 'Chudleigh',
      city: 'Lusaka',
      phone: '+260 95 678 9012',
    },
    items: [
      {
        id: 'item_16',
        order_id: '16',
        product_id: 'p18',
        quantity: 1,
        price_at_purchase: 995,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2025-12-28T11:00:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2025-12-28T11:15:00Z', changed_by: 'admin@luxury.com' },
      { status: 'shipped', changed_at: '2025-12-29T08:30:00Z', changed_by: 'admin@luxury.com' },
      { status: 'delivered', changed_at: '2025-12-31T10:00:00Z', changed_by: 'System' },
    ]
  },
  {
    id: '17',
    order_number: 'ORD-2026-0107',
    customer_name: 'Susan Mbewe',
    customer_email: 'susan.mbewe@example.com',
    customer_phone: '+260 96 789 0123',
    user_id: 'user_17',
    status: 'pending',
    payment_status: 'pending',
    payment_method: 'Bank Transfer',
    total_zmw: 1650,
    created_at: '2026-01-11T09:00:00Z',
    shipping_address: {
      first_name: 'Susan',
      last_name: 'Mbewe',
      address: '55 Lukasu Road',
      area: 'Kaunda Square',
      city: 'Lusaka',
      phone: '+260 96 789 0123',
    },
    items: [
      {
        id: 'item_17',
        order_id: '17',
        product_id: 'p19',
        quantity: 2,
        price_at_purchase: 825,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-11T09:00:00Z', changed_by: 'System' },
    ],
    notes: 'Bank transfer pending verification'
  },
  {
    id: '18',
    order_number: 'ORD-2026-0106',
    customer_name: 'Charles Moyo',
    customer_email: 'charles.moyo@example.com',
    customer_phone: '+260 97 890 1234',
    user_id: 'user_18',
    status: 'shipped',
    payment_status: 'completed',
    payment_method: 'Visa Card',
    total_zmw: 1340,
    created_at: '2026-01-05T15:20:00Z',
    tracking_number: 'TRK-ZM-258147',
    shipping_address: {
      first_name: 'Charles',
      last_name: 'Moyo',
      address: '88 Nangwenya Road',
      area: 'Kabwata',
      city: 'Lusaka',
      phone: '+260 97 890 1234',
    },
    items: [
      {
        id: 'item_18a',
        order_id: '18',
        product_id: 'p20',
        quantity: 1,
        price_at_purchase: 890,
      },
      {
        id: 'item_18b',
        order_id: '18',
        product_id: 'p21',
        quantity: 1,
        price_at_purchase: 450,
      }
    ],
    status_history: [
      { status: 'pending', changed_at: '2026-01-05T15:20:00Z', changed_by: 'System' },
      { status: 'paid', changed_at: '2026-01-05T15:25:00Z', changed_by: 'admin@luxury.com' },
      { status: 'shipped', changed_at: '2026-01-06T10:00:00Z', changed_by: 'admin@luxury.com' },
    ]
  }
]
