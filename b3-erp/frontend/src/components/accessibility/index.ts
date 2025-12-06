// Accessibility Components (WCAG 2.1 AA)
// Feature 25: Comprehensive accessibility enhancements

// Skip Links - Skip to main content navigation
export {
  SkipLinks,
  MainContent,
  NavigationLandmark,
  SearchLandmark,
  FooterLandmark,
  useSkipToContent,
  SKIP_TARGETS,
} from './SkipLinks';
export type {
  SkipTarget,
  SkipLinkItem,
  SkipLinksProps,
  MainContentProps,
  NavigationLandmarkProps,
  SearchLandmarkProps,
  FooterLandmarkProps,
} from './SkipLinks';

// ARIA Utilities - Comprehensive ARIA attributes
export {
  LiveRegionProvider,
  useLiveRegion,
  VisuallyHidden,
  AriaDescribedBy,
  LoadingAnnouncer,
  AccessibleError,
  AccessibleField,
  AccessibleProgress,
  AccessibleTabs,
  AccessibleToggle,
} from './AriaUtils';
export type {
  AriaLivePoliteness,
  LiveRegionContextValue,
  LiveRegionProviderProps,
  VisuallyHiddenProps,
  AriaDescribedByProps,
  LoadingAnnouncerProps,
  AccessibleErrorProps,
  AccessibleFieldProps,
  AccessibleProgressProps,
  TabItem,
  AccessibleTabsProps,
  AccessibleToggleProps,
} from './AriaUtils';

// Focus Management - Focus trap and modal support
export {
  FocusTrap,
  AccessibleModal,
  FocusProvider,
  useFocusManager,
  useFocusReturn,
  useRovingTabIndex,
} from './FocusTrap';
export type {
  FocusTrapProps,
  AccessibleModalProps,
  FocusContextValue,
  UseRovingTabIndexOptions,
} from './FocusTrap';

// Keyboard Shortcuts - Documented keyboard navigation
export {
  KeyboardShortcutsProvider,
  useKeyboardShortcuts,
  useShortcut,
  ShortcutsHelpDialog,
  KeyCombo,
  useCommonShortcuts,
} from './KeyboardShortcuts';
export type {
  KeyboardShortcut,
  KeyboardShortcutsContextValue,
  KeyboardShortcutsProviderProps,
  ShortcutsHelpDialogProps,
  KeyComboProps,
  CommonShortcutsOptions,
} from './KeyboardShortcuts';

// Motion and Contrast - Reduced motion and color contrast
export {
  ReducedMotionProvider,
  useReducedMotion,
  useMotionSafe,
  MotionSafe,
  // Contrast utilities
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  meetsWCAGContrast,
  getAccessibleTextColor,
  ContrastChecker,
  // High contrast mode
  HighContrastProvider,
  useHighContrast,
  // Settings panel
  AccessibilitySettings,
} from './MotionAndContrast';
export type {
  ReducedMotionContextValue,
  ReducedMotionProviderProps,
  MotionSafeProps,
  RGB,
  WCAGLevel,
  TextSize,
  ContrastCheckerProps,
  HighContrastContextValue,
  HighContrastProviderProps,
  AccessibilitySettingsProps,
} from './MotionAndContrast';
