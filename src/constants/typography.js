export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  hero: 34,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
};

export const typography = {
  hero: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  subtitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    lineHeight: 22,
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
  },
  captionBold: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  small: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
};

