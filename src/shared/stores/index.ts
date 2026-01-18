/**
 * Pinia Store Setup for Webapp
 */
import { createPinia } from 'pinia'

// Create the Pinia instance
export const pinia = createPinia()

export * from './authStore'