/**
 * Stripe Product Configuration
 * 
 * This file defines the products available for purchase through Stripe.
 * Products are dynamically created based on the database products.
 */

export interface StripeProductConfig {
  name: string;
  description: string;
  price: number; // in cents
  currency: string;
  images?: string[];
}

/**
 * Convert database product to Stripe product configuration
 */
export function createStripeProductConfig(product: {
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
}): StripeProductConfig {
  return {
    name: product.name,
    description: product.description || `Produto elegante da coleção Allure`,
    price: product.price,
    currency: 'brl',
    images: product.imageUrl ? [product.imageUrl] : [],
  };
}
