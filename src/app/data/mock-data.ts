export interface Product {
  id: number;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  price: number;
  comparePrice?: number;
  images: string[];
  thumbnail: string;
  stock: number;
  rating: number;
  reviewCount: number;
  brand: string;
  tags: string[];
  isNew: boolean;
  isFeatured: boolean;
  isSale: boolean;
  discountPercentage?: number;
  specifications: Record<string, string>;
  variants?: {
    color: string;
    size?: string;
    price?: number;
    stock?: number;
  }[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

export interface Order {
  id: string;
  userId: number;
  items: {
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  timeline: {
    status: string;
    date: string;
    description: string;
    completed: boolean;
  }[];
}

// Mock Products Data
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    title: 'MacBook Pro 16" - M3 Pro',
    description: 'The most powerful MacBook Pro ever is here. With the new M3 Pro chip, up to 22 hours of battery life, and a stunning Liquid Retina XDR display.',
    shortDescription: 'Supercharged by M3 Pro. Stunning Liquid Retina XDR display.',
    category: 'Computers',
    price: 2499,
    comparePrice: 2799,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    stock: 15,
    rating: 4.8,
    reviewCount: 324,
    brand: 'Apple',
    tags: ['laptop', 'professional', 'm3', 'apple'],
    isNew: true,
    isFeatured: true,
    isSale: true,
    discountPercentage: 11,
    specifications: {
      'Processor': 'Apple M3 Pro',
      'Display': '16.2" Liquid Retina XDR',
      'Memory': '18GB Unified Memory',
      'Storage': '512GB SSD',
      'Battery': 'Up to 22 hours',
      'Weight': '4.0 pounds'
    },
    variants: [
      { color: 'Space Gray', price: 2499, stock: 8 },
      { color: 'Silver', price: 2499, stock: 7 }
    ]
  },
  {
    id: 2,
    name: 'AirPods Pro 2',
    title: 'AirPods Pro (2nd Generation)',
    description: 'The AirPods Pro feature up to 2x more Active Noise Cancellation, Adaptive Transparency, and a personalized spatial audio experience.',
    shortDescription: 'Adaptive Audio. Now playing.',
    category: 'Audio',
    price: 249,
    comparePrice: 299,
    images: [
      'https://images.unsplash.com/photo-1606220945775-6a7831d5f4f3?w=800',
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1606220945775-6a7831d5f4f3?w=400',
    stock: 45,
    rating: 4.7,
    reviewCount: 892,
    brand: 'Apple',
    tags: ['wireless', 'earbuds', 'noise-cancelling', 'apple'],
    isNew: true,
    isFeatured: true,
    isSale: true,
    discountPercentage: 17,
    specifications: {
      'Chip': 'H2 chip',
      'Noise Cancellation': 'Up to 2x more Active Noise Cancellation',
      'Battery Life': '6 hours listening time',
      'Charging Case': '30 hours total listening',
      'Connectivity': 'Bluetooth 5.3',
      'Water Resistance': 'IPX4'
    }
  },
  {
    id: 3,
    name: 'iPad Air 5',
    title: 'iPad Air (5th Generation)',
    description: 'The powerful iPad Air features the M1 chip, a 10.9-inch Liquid Retina display, and works with Apple Pencil and Magic Keyboard.',
    shortDescription: 'Powerful. Colorful. Wonderful.',
    category: 'Computers',
    price: 599,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    stock: 22,
    rating: 4.6,
    reviewCount: 445,
    brand: 'Apple',
    tags: ['tablet', 'm1', 'apple-pencil', 'portable'],
    isNew: false,
    isFeatured: true,
    isSale: false,
    specifications: {
      'Chip': 'Apple M1',
      'Display': '10.9" Liquid Retina',
      'Storage': '64GB',
      'Cameras': '12MP Wide, 12MP Ultra Wide',
      'Battery': 'Up to 10 hours',
      'Weight': '1.0 pound'
    }
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer, crystal-clear hands-free calling, and exceptional sound quality.',
    shortDescription: 'Silence the world around you.',
    category: 'Audio',
    price: 379,
    comparePrice: 429,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849701-f40256c3f55f?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 18,
    rating: 4.5,
    reviewCount: 567,
    brand: 'Sony',
    tags: ['headphones', 'noise-cancelling', 'wireless', 'sony'],
    isNew: false,
    isFeatured: true,
    isSale: true,
    discountPercentage: 12,
    specifications: {
      'Noise Cancellation': 'Industry-leading ANC',
      'Battery Life': '30 hours',
      'Charging': '3 min charge = 3 hours playback',
      'Drivers': '30mm drivers',
      'Connectivity': 'Bluetooth 5.2',
      'Weight': '8.8 ounces'
    }
  },
  {
    id: 5,
    name: 'Apple Watch Ultra 2',
    title: 'Apple Watch Ultra 2',
    description: 'The most rugged and capable Apple Watch ever, designed for exploration, adventure, and endurance.',
    shortDescription: 'Adventure awaits.',
    category: 'Wearables',
    price: 799,
    images: [
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
    stock: 12,
    rating: 4.9,
    reviewCount: 234,
    brand: 'Apple',
    tags: ['smartwatch', 'fitness', 'outdoor', 'apple'],
    isNew: true,
    isFeatured: true,
    isSale: false,
    specifications: {
      'Display': '49mm Always-On Retina LTPO OLED',
      'Chip': 'S9 SiP',
      'GPS': 'Dual-frequency GPS',
      'Water Resistance': '100m water resistance',
      'Battery': 'Up to 36 hours',
      'Materials': 'Titanium case'
    }
  },
  {
    id: 6,
    name: 'Samsung Galaxy S24 Ultra',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'The ultimate Galaxy smartphone with built-in S Pen, advanced camera system, and AI-powered features.',
    shortDescription: 'Galaxy AI is here.',
    category: 'Phone',
    price: 1199,
    comparePrice: 1399,
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
      'https://images.unsplash.com/photo-1605236453806-b25a40db2d11?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
    stock: 8,
    rating: 4.7,
    reviewCount: 189,
    brand: 'Samsung',
    tags: ['smartphone', 'android', 's-pen', 'camera'],
    isNew: true,
    isFeatured: true,
    isSale: true,
    discountPercentage: 14,
    specifications: {
      'Display': '6.8" Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '200MP + 50MP + 12MP + 10MP',
      'Memory': '12GB RAM',
      'Storage': '256GB',
      'Battery': '5000mAh',
      'S Pen': 'Built-in S Pen included'
    }
  },
  {
    id: 7,
    name: 'PlayStation 5',
    title: 'PlayStation 5 Console',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, and dynamic, adaptive triggers.',
    shortDescription: 'Play Has No Limits.',
    category: 'Gaming',
    price: 499,
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417ae99c4e?w=800',
      'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417ae99c4e?w=400',
    stock: 5,
    rating: 4.8,
    reviewCount: 1023,
    brand: 'Sony',
    tags: ['gaming', 'console', 'playstation', '4k'],
    isNew: false,
    isFeatured: true,
    isSale: false,
    specifications: {
      'CPU': 'AMD Zen 2',
      'GPU': 'AMD RDNA 2',
      'Memory': '16GB GDDR6',
      'Storage': '825GB SSD',
      'Resolution': 'Up to 8K output',
      'Frame Rate': 'Up to 120fps'
    }
  },
  {
    id: 8,
    name: 'DJI Mini 3 Pro',
    title: 'DJI Mini 3 Pro Drone',
    description: 'Compact and powerful drone with 4K HDR video, 48MP photos, and advanced flight features.',
    shortDescription: 'Imaging Above All.',
    category: 'Accessories',
    price: 759,
    images: [
      'https://images.unsplash.com/photo-1621075494065-921c73f123c7?w=800',
      'https://images.unsplash.com/photo-1444703686981-a3abbcba082e?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1621075494065-921c73f123c7?w=400',
    stock: 14,
    rating: 4.6,
    reviewCount: 156,
    brand: 'DJI',
    tags: ['drone', 'camera', '4k', 'portable'],
    isNew: false,
    isFeatured: false,
    isSale: false,
    specifications: {
      'Camera': '1/1.3-inch CMOS, 48MP',
      'Video': '4K/60fps HDR',
      'Flight Time': '34 minutes',
      'Weight': '249 grams',
      'Range': '12 km HD video transmission',
      'Obstacle Sensing': 'Tri-directional'
    }
  },
  {
    id: 9,
    name: 'Bose QuietComfort 45',
    title: 'Bose QuietComfort 45 Headphones',
    description: 'World-class noise cancellation, exclusive acoustic architecture, and a quiet mode for full noise cancellation.',
    shortDescription: 'Quiet comfort, amplified.',
    category: 'Audio',
    price: 329,
    comparePrice: 379,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 31,
    rating: 4.4,
    reviewCount: 412,
    brand: 'Bose',
    tags: ['headphones', 'noise-cancelling', 'comfort', 'bose'],
    isNew: false,
    isFeatured: false,
    isSale: true,
    discountPercentage: 13,
    specifications: {
      'Noise Cancellation': 'World-class ANC',
      'Battery Life': '24 hours',
      'Audio': 'Tri-port acoustic architecture',
      'Microphones': '4-microphone system',
      'Connectivity': 'Bluetooth 5.1',
      'Weight': '7.1 ounces'
    }
  },
  {
    id: 10,
    name: 'iPad Pro 12.9"',
    title: 'iPad Pro 12.9" (M2)',
    description: 'The ultimate iPad experience with M2 chip, stunning 12.9-inch Liquid Retina XDR display, and pro-level performance.',
    shortDescription: 'Supercharged by M2.',
    category: 'Computers',
    price: 1099,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    stock: 9,
    rating: 4.7,
    reviewCount: 278,
    brand: 'Apple',
    tags: ['tablet', 'pro', 'm2', 'apple-pencil'],
    isNew: false,
    isFeatured: true,
    isSale: false,
    specifications: {
      'Chip': 'Apple M2',
      'Display': '12.9" Liquid Retina XDR',
      'Storage': '128GB',
      'Camera': '12MP Wide, 10MP Ultra Wide',
      'Battery': 'Up to 10 hours',
      'Weight': '1.5 pounds'
    }
  },
  {
    id: 11,
    name: 'Nike Air Max 270',
    title: 'Nike Air Max 270 Sneakers',
    description: 'Bold style meets exceptional comfort with the Air Max 270, featuring the largest Air unit yet.',
    shortDescription: 'Big Air. Bold Style.',
    category: 'Accessories',
    price: 150,
    comparePrice: 180,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    stock: 67,
    rating: 4.3,
    reviewCount: 89,
    brand: 'Nike',
    tags: ['shoes', 'sneakers', 'sports', 'fashion'],
    isNew: false,
    isFeatured: false,
    isSale: true,
    discountPercentage: 17,
    specifications: {
      'Air Unit': '270 Air unit',
      'Upper': 'Mesh and synthetic',
      'Outsole': 'Rubber',
      'Technology': 'Air Max cushioning',
      'Fit': 'Regular fit',
      'Activity': 'Lifestyle'
    }
  },
  {
    id: 12,
    name: 'Canon EOS R6 Mark II',
    title: 'Canon EOS R6 Mark II Camera',
    description: 'Professional full-frame mirrorless camera with advanced autofocus and 8K video recording.',
    shortDescription: 'Creativity without limits.',
    category: 'Accessories',
    price: 2499,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    stock: 6,
    rating: 4.9,
    reviewCount: 67,
    brand: 'Canon',
    tags: ['camera', 'mirrorless', 'professional', '8k'],
    isNew: true,
    isFeatured: false,
    isSale: false,
    specifications: {
      'Sensor': '24.2MP Full-frame CMOS',
      'Processor': 'DIGIC X',
      'Video': '8K RAW video',
      'Autofocus': 'Dual Pixel CMOS AF II',
      'ISO Range': '100-102400',
      'Continuous Shooting': '12 fps'
    }
  },
  {
    id: 13,
    name: 'Samsung Galaxy Watch 6',
    title: 'Samsung Galaxy Watch 6',
    description: 'Advanced health monitoring, fitness tracking, and seamless smartphone integration in a sleek design.',
    shortDescription: 'Health. Fitness. Life.',
    category: 'Wearables',
    price: 329,
    comparePrice: 399,
    images: [
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
    stock: 24,
    rating: 4.5,
    reviewCount: 145,
    brand: 'Samsung',
    tags: ['smartwatch', 'fitness', 'health', 'samsung'],
    isNew: false,
    isFeatured: false,
    isSale: true,
    discountPercentage: 18,
    specifications: {
      'Display': '1.3" Super AMOLED',
      'Processor': 'Exynos W920',
      'Battery': 'Up to 40 hours',
      'Water Resistance': '5ATM + IP68',
      'Sensors': 'BioActive Sensor',
      'Connectivity': 'Bluetooth 5.3, Wi-Fi'
    }
  },
  {
    id: 14,
    name: 'Xbox Series X',
    title: 'Xbox Series X Console',
    description: 'Fastest, most powerful Xbox ever with 12 teraflops of processing power for immersive gaming.',
    shortDescription: 'Power your dreams.',
    category: 'Gaming',
    price: 499,
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417ae99c4e?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417ae99c4e?w=400',
    stock: 7,
    rating: 4.7,
    reviewCount: 892,
    brand: 'Microsoft',
    tags: ['gaming', 'console', 'xbox', '4k'],
    isNew: false,
    isFeatured: true,
    isSale: false,
    specifications: {
      'GPU': '12 teraflops',
      'Memory': '16GB GDDR6',
      'Storage': '1TB SSD',
      'Resolution': '8K HDR',
      'Frame Rate': 'Up to 120fps',
      'Ray Tracing': 'Hardware-accelerated'
    }
  },
  {
    id: 15,
    name: 'JBL Flip 6',
    title: 'JBL Flip 6 Portable Speaker',
    description: 'Compact waterproof speaker with powerful sound and 12 hours of playtime.',
    shortDescription: 'Bold sound. Anywhere.',
    category: 'Audio',
    price: 129,
    comparePrice: 149,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    stock: 89,
    rating: 4.2,
    reviewCount: 234,
    brand: 'JBL',
    tags: ['speaker', 'portable', 'waterproof', 'bluetooth'],
    isNew: false,
    isFeatured: false,
    isSale: true,
    discountPercentage: 13,
    specifications: {
      'Sound': '30W output power',
      'Battery': '12 hours playtime',
      'Water Resistance': 'IP67',
      'Connectivity': 'Bluetooth 5.1',
      'Weight': '0.9 pounds',
      'Drivers': '2 x 20mm racetrack drivers'
    }
  },
  {
    id: 16,
    name: 'Logitech MX Master 3S',
    title: 'Logitech MX Master 3S Mouse',
    description: 'Advanced wireless mouse with precision scrolling and customizable buttons for productivity.',
    shortDescription: 'Master your workflow.',
    category: 'Accessories',
    price: 99,
    images: [
      'https://images.unsplash.com/photo-1615664695073-c169be127252?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1615664695073-c169be127252?w=400',
    stock: 156,
    rating: 4.6,
    reviewCount: 445,
    brand: 'Logitech',
    tags: ['mouse', 'wireless', 'productivity', 'ergonomic'],
    isNew: false,
    isFeatured: false,
    isSale: false,
    specifications: {
      'Sensor': '8000 DPI darkfield sensor',
      'Scroll Wheel': 'MagSpeed electromagnetic scrolling',
      'Buttons': '7 customizable buttons',
      'Battery': '70 days on full charge',
      'Connectivity': 'Bluetooth, USB-C',
      'Compatibility': 'Windows, macOS, Linux'
    }
  },
  {
    id: 17,
    name: 'Google Pixel 8 Pro',
    title: 'Google Pixel 8 Pro',
    description: 'Advanced AI-powered camera, Tensor G3 chip, and 7 years of security updates.',
    shortDescription: 'The best of Google. Built in.',
    category: 'Phone',
    price: 999,
    comparePrice: 1099,
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
    stock: 11,
    rating: 4.5,
    reviewCount: 178,
    brand: 'Google',
    tags: ['smartphone', 'android', 'camera', 'ai'],
    isNew: true,
    isFeatured: false,
    isSale: true,
    discountPercentage: 9,
    specifications: {
      'Display': '6.7" LTPO OLED',
      'Processor': 'Google Tensor G3',
      'Camera': '50MP + 48MP + 12MP',
      'Memory': '12GB RAM',
      'Storage': '256GB',
      'Battery': '5050mAh',
      'Updates': '7 years of security updates'
    }
  },
  {
    id: 18,
    name: 'Dell XPS 15',
    title: 'Dell XPS 15 Laptop',
    description: 'Premium Windows laptop with stunning 4K display and powerful performance for creative professionals.',
    shortDescription: 'Creativity at your command.',
    category: 'Computers',
    price: 1799,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    stock: 13,
    rating: 4.4,
    reviewCount: 89,
    brand: 'Dell',
    tags: ['laptop', 'windows', '4k', 'creative'],
    isNew: false,
    isFeatured: false,
    isSale: false,
    specifications: {
      'Processor': 'Intel Core i7-13700H',
      'Display': '15.6" 4K OLED',
      'Memory': '16GB DDR5',
      'Storage': '1TB SSD',
      'Graphics': 'NVIDIA GeForce RTX 4060',
      'Battery': 'Up to 10 hours'
    }
  },
  {
    id: 19,
    name: 'Beats Studio Pro',
    title: 'Beats Studio Pro Headphones',
    description: 'Premium noise-cancelling headphones with exceptional sound quality and all-day comfort.',
    shortDescription: 'Sound that moves you.',
    category: 'Audio',
    price: 349,
    comparePrice: 399,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 28,
    rating: 4.3,
    reviewCount: 67,
    brand: 'Beats',
    tags: ['headphones', 'noise-cancelling', 'apple', 'premium'],
    isNew: false,
    isFeatured: false,
    isSale: true,
    discountPercentage: 13,
    specifications: {
      'Noise Cancellation': 'Adaptive ANC',
      'Battery Life': '40 hours',
      'Charging': 'USB-C charging',
      'Audio': 'Custom acoustic architecture',
      'Microphones': 'Voice-targeting mics',
      'Weight': '9.7 ounces'
    }
  },
  {
    id: 20,
    name: 'Garmin Fenix 7X',
    title: 'Garmin Fenix 7X Smartwatch',
    description: 'Premium multisport GPS watch with advanced training features and solar charging.',
    shortDescription: 'Engineered for adventure.',
    category: 'Wearables',
    price: 899,
    images: [
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
    stock: 4,
    rating: 4.8,
    reviewCount: 34,
    brand: 'Garmin',
    tags: ['smartwatch', 'gps', 'sports', 'outdoor'],
    isNew: false,
    isFeatured: false,
    isSale: false,
    specifications: {
      'Display': '1.4" solar-charged display',
      'Battery': 'Up to 37 days with solar',
      'GPS': 'Multi-band GNSS',
      'Sports': '30+ activity profiles',
      'Water Resistance': '10ATM',
      'Mapping': 'TopoActive maps'
    }
  },
  {
    id: 21,
    name: 'Razer Blade 16',
    title: 'Razer Blade 16 Gaming Laptop',
    description: 'Ultimate gaming laptop with dual-mode Mini-LED display and cutting-edge performance.',
    shortDescription: 'The best of both worlds.',
    category: 'Gaming',
    price: 2699,
    comparePrice: 2999,
    images: [
      'https://images.unsplash.com/photo-1593305841915-7d98704d411d?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1593305841915-7d98704d411d?w=400',
    stock: 3,
    rating: 4.7,
    reviewCount: 45,
    brand: 'Razer',
    tags: ['gaming', 'laptop', 'high-performance', 'rgb'],
    isNew: false,
    isFeatured: false,
    isSale: true,
    discountPercentage: 10,
    specifications: {
      'Processor': 'Intel Core i9-13950HX',
      'Display': '16" Dual-mode Mini-LED',
      'Graphics': 'NVIDIA GeForce RTX 4090',
      'Memory': '32GB DDR5',
      'Storage': '1TB NVMe SSD',
      'Keyboard': 'Razer Chroma RGB'
    }
  },
  {
    id: 22,
    name: 'Anker PowerCore 10000',
    title: 'Anker PowerCore 10000 Portable Charger',
    description: 'Ultra-compact 10,000mAh power bank with fast charging for all your devices.',
    shortDescription: 'Power on the go.',
    category: 'Accessories',
    price: 29,
    comparePrice: 39,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    stock: 234,
    rating: 4.1,
    reviewCount: 567,
    brand: 'Anker',
    tags: ['powerbank', 'portable', 'charging', 'compact'],
    isNew: false,
    isFeatured: false,
    isSale: true,
    discountPercentage: 26,
    specifications: {
      'Capacity': '10,000mAh',
      'Output': '22.5W PowerIQ',
      'Input': 'USB-C input',
      'Size': 'Ultra-compact design',
      'Weight': '6.6 ounces',
      'Safety': 'MultiProtect safety system'
    }
  }
];

// Mock Users Data
export const MOCK_USERS: User[] = [
  {
    id: 1,
    email: 'admin@safistore.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Admin Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States'
    },
    joinDate: '2023-01-15',
    totalOrders: 0,
    totalSpent: 0
  },
  {
    id: 2,
    email: 'user@safistore.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '+1 (555) 987-6543',
    address: {
      street: '456 Customer Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    joinDate: '2023-03-20',
    totalOrders: 12,
    totalSpent: 15420
  },
  {
    id: 3,
    email: 'sarah@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    phone: '+1 (555) 246-8135',
    address: {
      street: '789 Tech Boulevard',
      city: 'Austin',
      state: 'TX',
      zip: '73301',
      country: 'United States'
    },
    joinDate: '2023-06-10',
    totalOrders: 8,
    totalSpent: 8750
  },
  {
    id: 4,
    email: 'mike@example.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    phone: '+1 (555) 369-2580',
    address: {
      street: '321 Innovation Drive',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'United States'
    },
    joinDate: '2023-08-15',
    totalOrders: 5,
    totalSpent: 4320
  },
  {
    id: 5,
    email: 'emma@example.com',
    firstName: 'Emma',
    lastName: 'Davis',
    role: 'Customer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    phone: '+1 (555) 147-2583',
    address: {
      street: '654 Creative Lane',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      country: 'United States'
    },
    joinDate: '2023-09-22',
    totalOrders: 15,
    totalSpent: 22100
  }
];

// Mock Reviews Data
export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    productId: 1,
    userId: 2,
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    title: 'Absolutely incredible laptop!',
    comment: 'The M3 Pro chip is unbelievably fast. I can run multiple development environments, video editing software, and still have smooth performance. The display is stunning and the battery life is amazing.',
    date: '2024-01-15',
    helpful: 45,
    verified: true
  },
  {
    id: 2,
    productId: 1,
    userId: 3,
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    rating: 4,
    title: 'Great but expensive',
    comment: 'Performance is outstanding and the build quality is premium. My only complaint is the price, but you get what you pay for. The screen is gorgeous for creative work.',
    date: '2024-01-10',
    helpful: 23,
    verified: true
  },
  {
    id: 3,
    productId: 2,
    userId: 4,
    userName: 'Mike Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 5,
    title: 'Best noise cancellation yet',
    comment: 'The adaptive transparency feature is brilliant. The sound quality is crystal clear and the fit is comfortable for long periods. Battery life has been excellent.',
    date: '2024-01-08',
    helpful: 67,
    verified: true
  },
  {
    id: 4,
    productId: 5,
    userId: 5,
    userName: 'Emma Davis',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 5,
    title: 'Perfect for outdoor adventures',
    comment: 'The GPS accuracy is spot-on and the battery life with solar charging is incredible. I took it on a week-long hiking trip and never worried about running out of power.',
    date: '2024-01-05',
    helpful: 34,
    verified: true
  }
];

// Mock Orders Data
export const MOCK_ORDERS: Order[] = [
  {
    id: 'SAF-2024-0001',
    userId: 2,
    items: [
      {
        productId: 1,
        productName: 'MacBook Pro 16" - M3 Pro',
        productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200',
        quantity: 1,
        price: 2499,
        total: 2499
      },
      {
        productId: 2,
        productName: 'AirPods Pro 2',
        productImage: 'https://images.unsplash.com/photo-1606220945775-6a7831d5f4f3?w=200',
        quantity: 1,
        price: 249,
        total: 249
      }
    ],
    subtotal: 2748,
    shipping: 0,
    tax: 274.80,
    total: 3022.80,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '456 Customer Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    paymentMethod: 'Credit Card',
    orderDate: '2024-01-10',
    estimatedDelivery: '2024-01-15',
    trackingNumber: '1Z999AA10123456784',
    timeline: [
      {
        status: 'Order Placed',
        date: '2024-01-10 14:30',
        description: 'Your order has been received',
        completed: true
      },
      {
        status: 'Processing',
        date: '2024-01-11 09:15',
        description: 'Your order is being processed',
        completed: true
      },
      {
        status: 'Shipped',
        date: '2024-01-12 16:45',
        description: 'Your order has been shipped',
        completed: true
      },
      {
        status: 'Out for Delivery',
        date: '2024-01-15 08:00',
        description: 'Your package is out for delivery',
        completed: true
      },
      {
        status: 'Delivered',
        date: '2024-01-15 14:20',
        description: 'Your package has been delivered',
        completed: true
      }
    ]
  },
  {
    id: 'SAF-2024-0002',
    userId: 3,
    items: [
      {
        productId: 5,
        productName: 'Apple Watch Ultra 2',
        productImage: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=200',
        quantity: 1,
        price: 799,
        total: 799
      }
    ],
    subtotal: 799,
    shipping: 10,
    tax: 79.90,
    total: 888.90,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '789 Tech Boulevard',
      city: 'Austin',
      state: 'TX',
      zip: '73301',
      country: 'United States'
    },
    paymentMethod: 'PayPal',
    orderDate: '2024-01-18',
    estimatedDelivery: '2024-01-23',
    trackingNumber: '1Z999AA10123456785',
    timeline: [
      {
        status: 'Order Placed',
        date: '2024-01-18 11:20',
        description: 'Your order has been received',
        completed: true
      },
      {
        status: 'Processing',
        date: '2024-01-19 10:30',
        description: 'Your order is being processed',
        completed: true
      },
      {
        status: 'Shipped',
        date: '2024-01-20 15:45',
        description: 'Your order has been shipped',
        completed: true
      },
      {
        status: 'Out for Delivery',
        date: '2024-01-23 07:00',
        description: 'Your package is out for delivery',
        completed: false
      },
      {
        status: 'Delivered',
        date: 'Estimated',
        description: 'Your package will be delivered',
        completed: false
      }
    ]
  },
  {
    id: 'SAF-2024-0003',
    userId: 4,
    items: [
      {
        productId: 7,
        productName: 'PlayStation 5 Console',
        productImage: 'https://images.unsplash.com/photo-1606144042614-b2417ae99c4e?w=200',
        quantity: 1,
        price: 499,
        total: 499
      },
      {
        productId: 4,
        productName: 'Sony WH-1000XM5',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
        quantity: 1,
        price: 379,
        total: 379
      }
    ],
    subtotal: 878,
    shipping: 0,
    tax: 87.80,
    total: 965.80,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '321 Innovation Drive',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'United States'
    },
    paymentMethod: 'Credit Card',
    orderDate: '2024-01-20',
    estimatedDelivery: '2024-01-25',
    timeline: [
      {
        status: 'Order Placed',
        date: '2024-01-20 16:45',
        description: 'Your order has been received',
        completed: true
      },
      {
        status: 'Processing',
        date: '2024-01-21 09:00',
        description: 'Your order is being processed',
        completed: true
      },
      {
        status: 'Shipped',
        date: 'Estimated',
        description: 'Your order will be shipped soon',
        completed: false
      },
      {
        status: 'Out for Delivery',
        date: 'Estimated',
        description: 'Your package will be out for delivery',
        completed: false
      },
      {
        status: 'Delivered',
        date: 'Estimated',
        description: 'Your package will be delivered',
        completed: false
      }
    ]
  }
];

// Categories for filtering
export const CATEGORIES = [
  'All',
  'Computers',
  'Audio',
  'Wearables',
  'Gaming',
  'Accessories',
  'Phone'
];

// Brands for filtering
export const BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'Nike',
  'Canon',
  'Dell',
  'Microsoft',
  'Google',
  'Razer',
  'Logitech',
  'JBL',
  'Bose',
  'Beats',
  'Anker',
  'Garmin',
  'DJI'
];

// Helper functions
export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'All') return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return MOCK_PRODUCTS.filter(product => product.isFeatured);
};

export const getNewProducts = (): Product[] => {
  return MOCK_PRODUCTS.filter(product => product.isNew);
};

export const getSaleProducts = (): Product[] => {
  return MOCK_PRODUCTS.filter(product => product.isSale);
};

export const getProductById = (id: number): Product | undefined => {
  return MOCK_PRODUCTS.find(product => product.id === id);
};

export const getProductsByBrand = (brand: string): Product[] => {
  return MOCK_PRODUCTS.filter(product => product.brand === brand);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getReviewsByProductId = (productId: number): Review[] => {
  return MOCK_REVIEWS.filter(review => review.productId === productId);
};

export const getOrdersByUserId = (userId: number): Order[] => {
  return MOCK_ORDERS.filter(order => order.userId === userId);
};
