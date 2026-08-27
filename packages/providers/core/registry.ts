import { AIProvider } from './provider.interface';

/**
 * Global provider registry
 * Allows dynamic registration and lookup of providers without modifying NOIR core
 */
const registry = new Map<string, AIProvider>();

/**
 * Register a provider with NOIR
 */
export function registerProvider(provider: AIProvider): void {
  if (registry.has(provider.id)) {
    console.warn(`Provider '${provider.id}' already registered, overwriting`);
  }
  registry.set(provider.id, provider);
  console.log(`✅ Registered provider: ${provider.name} (${provider.id})`);
}

/**
 * Get a provider by ID
 */
export function getProvider(id: string): AIProvider | undefined {
  return registry.get(id);
}

/**
 * Get all registered providers
 */
export function getAllProviders(): AIProvider[] {
  return Array.from(registry.values());
}

/**
 * Get providers by category
 */
export function getProvidersByCategory(category: string): AIProvider[] {
  return Array.from(registry.values()).filter((p) => p.category === category);
}

/**
 * Check if provider is registered
 */
export function hasProvider(id: string): boolean {
  return registry.has(id);
}

/**
 * Unregister a provider (mainly for testing)
 */
export function unregisterProvider(id: string): boolean {
  return registry.delete(id);
}

/**
 * Get provider count
 */
export function getProviderCount(): number {
  return registry.size;
}
