// Micro-Interactions Components
// Feature 28: Consistent animations and feedback across the application

// Button Feedback
export {
  ButtonFeedback,
  InteractiveButton,
  IconButtonFeedback,
  Pressable,
} from './ButtonFeedback';

export type {
  ButtonFeedbackVariant,
  ButtonFeedbackProps,
  InteractiveButtonState,
  InteractiveButtonProps,
  IconButtonFeedbackProps,
  PressableProps,
} from './ButtonFeedback';

// Transition System
export {
  TRANSITION_DURATIONS,
  TRANSITION_EASINGS,
  TRANSITION_PRESETS,
  createTransition,
  transitions,
  Transition,
  Fade,
  Slide,
  Scale,
  Collapse,
  TransitionGroup,
  useTransitionGroup,
  TransitionStyles,
} from './TransitionSystem';

export type {
  TransitionDuration,
  TransitionEasing,
  TransitionPreset,
  TransitionConfig,
  TransitionState,
  TransitionProps,
  FadeProps,
  SlideDirection,
  SlideProps,
  ScaleProps,
  CollapseProps,
  TransitionGroupProps,
} from './TransitionSystem';

// Loading Spinners
export {
  Spinner,
  LoadingOverlay,
  InlineLoading,
  ButtonLoading,
  ProgressSpinner,
  LoadingPlaceholder,
} from './LoadingSpinners';

export type {
  SpinnerSize,
  SpinnerVariant,
  SpinnerProps,
  LoadingOverlayProps,
  InlineLoadingProps,
  ButtonLoadingProps,
  ProgressSpinnerProps,
  LoadingPlaceholderProps,
} from './LoadingSpinners';

// Success Animations
export {
  AnimatedCheckmark,
  CheckmarkCircle,
  SuccessBurst,
  Confetti,
  SuccessScale,
  SuccessFeedback,
  useSuccess,
} from './SuccessAnimations';

export type {
  SuccessVariant,
  AnimatedCheckmarkProps,
  CheckmarkCircleProps,
  SuccessBurstProps,
  ConfettiProps,
  SuccessScaleProps,
  SuccessFeedbackProps,
  UseSuccessOptions,
} from './SuccessAnimations';

// Error Shake
export {
  ErrorShake,
  ErrorInput,
  ErrorMessage,
  FormFieldError,
  ErrorBoundaryShake,
  useErrorShake,
  ValidationErrorList,
  ToastError,
} from './ErrorShake';

export type {
  ErrorVariant,
  ErrorShakeProps,
  ErrorInputProps,
  ErrorMessageProps,
  FormFieldErrorProps,
  ErrorBoundaryShakeProps,
  UseErrorShakeOptions,
  ValidationError,
  ValidationErrorListProps,
  ToastErrorProps,
} from './ErrorShake';
