// Simple state management for the marketplace
import { PiUser } from './pi-sdk';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'digital' | 'physical' | 'services';
  image: string;
  seller: string;
  sellerReputation: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  recommended?: boolean;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'subscription';
  amount: number;
  item: string;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
}

// Mock products data
export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Premium UI Kit Bundle',
    description: 'Complete design system with 500+ components for modern web applications. Includes Figma files, React components, and documentation.',
    price: 25,
    category: 'digital',
    image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-18/o2bbbpyaagpq/category-digital-goods.png',
    seller: 'DesignPioneer',
    sellerReputation: 95,
    rating: 4.8,
    reviews: 124,
    inStock: true,
    tags: ['design', 'ui-kit', 'react'],
  },
  {
    id: 'p2',
    title: 'Blockchain Development Course',
    description: 'Learn to build decentralized applications on Pi Network. 40+ hours of video content with hands-on projects.',
    price: 50,
    category: 'digital',
    image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-18/o2bbbpyaagpq/category-digital-goods.png',
    seller: 'CryptoAcademy',
    sellerReputation: 92,
    rating: 4.9,
    reviews: 89,
    inStock: true,
    tags: ['education', 'blockchain', 'development'],
  },
  {
    id: 'p3',
    title: 'Handcrafted Leather Wallet',
    description: 'Premium handmade leather wallet with Pi Network logo embossed. Made from genuine Italian leather.',
    price: 15,
    category: 'physical',
    image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-18/o2bcnqaaagqa/category-physical-goods.png',
    seller: 'ArtisanCraft',
    sellerReputation: 88,
    rating: 4.6,
    reviews: 56,
    inStock: true,
    tags: ['accessories', 'handmade', 'leather'],
  },
  {
    id: 'p4',
    title: 'Pi Mining Hardware Kit',
    description: 'Custom-built hardware optimized for Pi Network node operation. Includes setup guide and lifetime support.',
    price: 120,
    category: 'physical',
    image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-18/o2bcnqaaagqa/category-physical-goods.png',
    seller: 'TechPioneer',
    sellerReputation: 91,
    rating: 4.7,
    reviews: 34,
    inStock: true,
    tags: ['hardware', 'mining', 'tech'],
  },
  {
    id: 'p5',
    title: 'Smart Contract Audit Service',
    description: 'Professional security audit for your Soroban smart contracts. Detailed report with recommendations.',
    price: 200,
    category: 'services',
    image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-18/o2bbvliaagpa/category-services-freelance.png',
    seller: 'SecureChain',
    sellerReputation: 97,
    rating: 5.0,
    reviews: 18,
    inStock: true,
    tags: ['security', 'audit', 'smart-contracts'],
  },
  {
    id: 'p6',
    title: 'Full-Stack Web Development',
    description: 'Custom web application development using React, Node.js, and Pi Network integration. 2-week delivery.',
    price: 350,
    category: 'services',
    image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-18/o2bbvliaagpa/category-services-freelance.png',
    seller: 'DevStudio',
    sellerReputation: 94,
    rating: 4.8,
    reviews: 42,
    inStock: true,
    tags: ['development', 'web', 'fullstack'],
  },
  {
    id: 'p7',
    title: 'NFT Art Collection Generator',
    description: 'AI-powered tool to generate unique NFT art collections. Includes metadata generator and marketplace listing.',
    price: 75,
    category: 'digital',
    image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-18/o2bbbpyaagpq/category-digital-goods.png',
    seller: 'ArtificialArt',
    sellerReputation: 86,
    rating: 4.5,
    reviews: 67,
    inStock: true,
    tags: ['nft', 'art', 'ai'],
  },
  {
    id: 'p8',
    title: 'Pi Branded Merchandise Pack',
    description: 'Complete merchandise pack: T-shirt, cap, stickers, and keychain. All featuring Pi Network designs.',
    price: 30,
    category: 'physical',
    image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-18/o2bcnqaaagqa/category-physical-goods.png',
    seller: 'PiMerch',
    sellerReputation: 90,
    rating: 4.4,
    reviews: 203,
    inStock: true,
    tags: ['merchandise', 'clothing', 'accessories'],
  },
];

export const SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'free',
    name: 'Pioneer Free',
    price: 0,
    period: 'monthly',
    features: [
      'List up to 3 products',
      'Basic analytics',
      'Community support',
      'Standard visibility',
    ],
  },
  {
    id: 'pro',
    name: 'Pioneer Pro',
    price: 10,
    period: 'monthly',
    features: [
      'Unlimited listings',
      'Advanced analytics',
      'Priority support',
      'Boosted visibility',
      'Custom storefront',
      'Transaction fee: 1%',
    ],
    recommended: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 50,
    period: 'monthly',
    features: [
      'Everything in Pro',
      'API access',
      'Dedicated account manager',
      'White-label options',
      'Bulk listing tools',
      'Transaction fee: 0.5%',
      'Smart contract integration',
    ],
  },
];

// Simple auth state management
let currentUser: PiUser | null = null;
const listeners: Set<() => void> = new Set();

export function setUser(user: PiUser | null) {
  currentUser = user;
  listeners.forEach(fn => fn());
}

export function getUser(): PiUser | null {
  return currentUser;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Cart management
let cart: { product: Product; quantity: number }[] = [];

export function addToCart(product: Product) {
  const existing = cart.find(item => item.product.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }
  listeners.forEach(fn => fn());
}

export function removeFromCart(productId: string) {
  cart = cart.filter(item => item.product.id !== productId);
  listeners.forEach(fn => fn());
}

export function getCart() {
  return cart;
}

export function clearCart() {
  cart = [];
  listeners.forEach(fn => fn());
}

export function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

// Mock transactions
export const TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'purchase', amount: 25, item: 'Premium UI Kit Bundle', date: '2026-05-15', status: 'completed' },
  { id: 't2', type: 'sale', amount: 15, item: 'Handcrafted Leather Wallet', date: '2026-05-14', status: 'completed' },
  { id: 't3', type: 'subscription', amount: 10, item: 'Pioneer Pro - Monthly', date: '2026-05-01', status: 'completed' },
  { id: 't4', type: 'purchase', amount: 50, item: 'Blockchain Development Course', date: '2026-04-28', status: 'completed' },
  { id: 't5', type: 'sale', amount: 200, item: 'Smart Contract Audit', date: '2026-04-20', status: 'completed' },
];