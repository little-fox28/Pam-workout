/**
 * Pam App — Design Token: Typography
 */
export const Typography = {
  fontFamily: {
    sans:     'Inter_400Regular',
    medium:   'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold:     'Inter_700Bold',
  },
  fontSize: {
    xs:   12,
    sm:   14,
    base: 16,
    lg:   18,
    xl:   20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  lineHeight: {
    tight:  1.25,
    snug:   1.375,
    normal: 1.5,
    relaxed:1.625,
  },
  letterSpacing: {
    tighter: -0.8,
    tight:   -0.4,
    normal:   0,
    wide:     0.4,
    wider:    0.8,
  },
} as const;
