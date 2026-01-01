/**
 * Blue/Ocean Theme Configuration
 * Calming blue tones with clean white cards
 */

export const oceanTheme = {
  // Primary colors - Ocean blues
  primary: {
    50: '#e0f2fe',   // Lightest blue
    100: '#bae6fd',
    200: '#7dd3fc',
    300: '#38bdf8',
    400: '#0ea5e9',
    500: '#0284c7',  // Main blue
    600: '#0369a1',
    700: '#075985',
    800: '#0c4a6e',
    900: '#082f49',  // Darkest blue
  },

  // Secondary colors - Teal/Cyan accents
  secondary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',  // Main teal
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Priority colors
  priority: {
    low: {
      bg: '#dbeafe',      // Light blue
      text: '#1e40af',
      border: '#3b82f6',
    },
    medium: {
      bg: '#fef3c7',      // Light amber
      text: '#92400e',
      border: '#f59e0b',
    },
    high: {
      bg: '#fee2e2',      // Light red
      text: '#991b1b',
      border: '#ef4444',
    },
  },

  // Background gradients
  gradients: {
    page: 'from-sky-50 via-blue-50 to-cyan-100',
    card: 'from-white to-blue-50/30',
    cardHover: 'from-white to-blue-100/40',
  },

  // Status colors
  status: {
    completed: {
      bg: '#d1fae5',
      text: '#065f46',
      border: '#10b981',
    },
    active: {
      bg: '#e0f2fe',
      text: '#075985',
      border: '#0ea5e9',
    },
  },
}

export const categoryColors = [
  { name: 'Work', color: '#0284c7', bg: '#e0f2fe' },
  { name: 'Personal', color: '#06b6d4', bg: '#cffafe' },
  { name: 'Shopping', color: '#8b5cf6', bg: '#ede9fe' },
  { name: 'Health', color: '#10b981', bg: '#d1fae5' },
  { name: 'Study', color: '#f59e0b', bg: '#fef3c7' },
  { name: 'Other', color: '#6b7280', bg: '#f3f4f6' },
]
