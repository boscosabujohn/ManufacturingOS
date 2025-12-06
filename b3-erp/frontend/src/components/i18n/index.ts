// Internationalization (i18n) Components
// Feature 33: Multi-language support with RTL and locale-aware formatting

// Language Switcher
export {
  SUPPORTED_LANGUAGES,
  LanguageProvider,
  useLanguage,
  LanguageSwitcher,
  LanguageSelect,
  TranslatedText,
  T,
} from './LanguageSwitcher';

export type {
  LanguageCode,
  Language,
  LanguageProviderProps,
  SwitcherVariant,
  LanguageSwitcherProps,
  LanguageSelectProps,
  TranslatedTextProps,
} from './LanguageSwitcher';

// RTL Support
export {
  RTLProvider,
  useRTL,
  logicalToPhysical,
  createLogicalSpacing,
  createLogicalPosition,
  flipTransform,
  RTLFlex,
  RTLIcon,
  RTLText,
  RTLBox,
  RTLPosition,
  rtlClasses,
  RTL_CLASS_MAPPINGS,
  useRTLClasses,
  BidiText,
  formatBidiText,
  RTLStyleSheet,
} from './RTLSupport';

export type {
  RTLProviderProps,
  RTLFlexProps,
  RTLIconProps,
  RTLTextProps,
  RTLBoxProps,
  RTLPositionProps,
  BidiTextProps,
  LogicalPosition,
  PhysicalPosition,
} from './RTLSupport';

// Locale Formatting
export {
  LocaleProvider,
  useLocale,
  FormattedDate,
  FormattedNumber,
  CurrencyDisplay,
  DateRange,
  RelativeTime,
  LocaleNumberInput,
  COMMON_CURRENCIES,
  CurrencySelector,
  COMMON_TIMEZONES,
  TimezoneSelector,
} from './LocaleFormatting';

export type {
  LocaleCode,
  LocaleConfig,
  LocaleProviderProps,
  FormattedDateProps,
  FormattedNumberProps,
  CurrencyDisplayProps,
  DateRangeProps,
  RelativeTimeProps,
  LocaleNumberInputProps,
  CurrencySelectorProps,
  TimezoneSelectorProps,
} from './LocaleFormatting';

// Translation System
export {
  DEFAULT_TRANSLATIONS,
  TranslationProvider,
  useTranslation,
  Trans,
  Plural,
  TranslationDebug,
} from './TranslationSystem';

export type {
  TranslationKey,
  TranslationParams,
  TranslationNamespace,
  TranslationResource,
  TranslationResources,
  TranslationProviderProps,
  TransProps,
  PluralProps,
  TranslationDebugProps,
} from './TranslationSystem';
