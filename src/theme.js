// MN Works Theme - Blue, White & Green Color Scheme

const theme = {
  // Primary Colors
  colors: {
    // Blues
    primary: '#2563eb',           // Royal Blue - Main primary color
    primaryDark: '#1e40af',       // Dark Blue - Headers, navbar
    primaryLight: '#3b82f6',      // Light Blue - Hover states
    primaryBg: '#eff6ff',         // Very light blue background

    // Greens
    success: '#10b981',           // Emerald Green - Success, CTA buttons
    successDark: '#059669',       // Dark Green - Hover states
    successLight: '#34d399',      // Light Green - Accents
    successBg: '#ecfdf5',         // Very light green background

    // Whites & Neutrals
    white: '#ffffff',
    background: '#f8fafc',        // Light gray-blue background
    cardBg: '#ffffff',

    // Text Colors
    textPrimary: '#1e3a5f',       // Dark blue text
    textSecondary: '#64748b',     // Gray text
    textMuted: '#94a3b8',         // Muted text
    textOnPrimary: '#ffffff',     // White text on colored backgrounds

    // Status Colors
    warning: '#f59e0b',           // Amber
    warningBg: '#fffbeb',
    danger: '#ef4444',            // Red
    dangerBg: '#fef2f2',
    info: '#0ea5e9',              // Sky blue
    infoBg: '#f0f9ff',

    // Borders
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    hero: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #10b981 100%)',
    card: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    balanceCard: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(37, 99, 235, 0.1)',
    lg: '0 10px 25px rgba(37, 99, 235, 0.15)',
    card: '0 4px 15px rgba(37, 99, 235, 0.1)',
    button: '0 4px 14px rgba(37, 99, 235, 0.25)',
    success: '0 4px 14px rgba(16, 185, 129, 0.25)',
  },

  // Border Radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Transitions
  transitions: {
    fast: 'all 0.15s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
};

// Common style patterns
export const commonStyles = {
  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },

  // Cards
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.card,
    padding: '1.5rem',
    border: `1px solid ${theme.colors.borderLight}`,
  },

  // Primary Button
  primaryButton: {
    backgroundColor: theme.colors.success,
    color: theme.colors.white,
    padding: '0.75rem 1.5rem',
    borderRadius: theme.radius.md,
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.fast,
    boxShadow: theme.shadows.success,
  },

  // Secondary Button
  secondaryButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    padding: '0.75rem 1.5rem',
    borderRadius: theme.radius.md,
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.fast,
    boxShadow: theme.shadows.button,
  },

  // Outline Button
  outlineButton: {
    backgroundColor: 'transparent',
    color: theme.colors.primary,
    padding: '0.75rem 1.5rem',
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.primary}`,
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.fast,
  },

  // Danger Button
  dangerButton: {
    backgroundColor: theme.colors.danger,
    color: theme.colors.white,
    padding: '0.75rem 1.5rem',
    borderRadius: theme.radius.md,
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.fast,
  },

  // Input
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    fontSize: '1rem',
    transition: theme.transitions.fast,
    outline: 'none',
  },

  // Title
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '2rem',
  },

  // Section Title
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: theme.colors.primaryDark,
    marginBottom: '1.5rem',
  },

  // Badge/Status
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: theme.radius.full,
    fontSize: '0.8rem',
    fontWeight: '600',
  },

  // Link
  link: {
    color: theme.colors.primary,
    textDecoration: 'none',
    fontWeight: '500',
    transition: theme.transitions.fast,
  },
};

export default theme;
