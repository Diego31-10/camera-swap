/**
 * Paleta de colores del tema Dracula
 * Centraliza todos los colores para mantener consistencia
 */
export const colors = {
    // Colores principales
    background: '#282a36',
    backgroundLight: '#44475a',
    foreground: '#f8f8f2',
    
    // Colores de acento
    green: '#50fa7b',      // Success / Save
    red: '#ff5555',        // Error / Discard
    cyan: '#8be9fd',       // Info
    purple: '#bd93f9',     // Accent
    yellow: '#f1fa8c',     // Warning
    orange: '#ffb86c',     // Alert
    pink: '#ff79c6',       // Highlight
    
    // Grises
    comment: '#6272a4',
    selection: '#44475a',
    
    // Estados
    success: '#50fa7b',
    error: '#ff5555',
    warning: '#f1fa8c',
    info: '#8be9fd',
  } as const;
  
  export type ColorName = keyof typeof colors;
  