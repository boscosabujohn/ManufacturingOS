// Shop Floor Tablet Interface Components
// Feature 24: Industrial-optimized components for shop floor operations

// Large Touch Targets - Big buttons for gloved hands (64-96px minimum)
export {
  LargeButton,
  StartButton,
  StopButton,
  PauseButton,
  ConfirmButton,
  CancelButton,
  AlertButton,
  NumberPad,
  LargeToggle,
  QuickActionGrid,
  LargeNavArrows,
  ShopFloorIcons,
} from './LargeButton';
export type {
  LargeButtonSize,
  LargeButtonVariant,
  LargeButtonProps,
  ActionButtonProps,
  NumberPadProps,
  LargeToggleProps,
  QuickActionItem,
  QuickActionGridProps,
  LargeNavArrowsProps,
} from './LargeButton';

// Simplified Views - Essential info only for operators
export {
  StatusIndicator,
  WorkOrderCard,
  ShopFloorKPI,
  OperationSteps,
  QualityCheckList,
  InfoRow,
  ShopFloorAlert,
  MachineStatus,
} from './SimplifiedView';
export type {
  OperationStatus,
  QualityStatus,
  StatusIndicatorProps,
  WorkOrderCardProps,
  ShopFloorKPIProps,
  OperationStep,
  OperationStepsProps,
  QualityCheckItem,
  QualityCheckListProps,
  InfoRowProps,
  ShopFloorAlertProps,
  MachineStatusProps,
} from './SimplifiedView';

// Quick Entry Forms - Minimal fields, maximum autocomplete
export {
  LargeInput,
  AutocompleteInput,
  QuantityInput,
  LargeSelect,
  QuickEntryForm,
  PartNumberField,
  WorkOrderField,
  OperatorField,
  LocationField,
} from './QuickEntryForm';
export type {
  LargeInputProps,
  AutocompleteItem,
  AutocompleteInputProps,
  QuantityInputProps,
  SelectOption,
  LargeSelectProps,
  QuickEntryFormProps,
  PartNumberFieldProps,
} from './QuickEntryForm';

// Barcode/QR Integration - Camera-based scanning
export {
  BarcodeScanner,
  ManualCodeEntry,
  ScannerWithFallback,
  ScanButton,
} from './BarcodeScanner';
export type {
  CodeType,
  ScanResult,
  BarcodeScannerProps,
  ManualCodeEntryProps,
  ScannerWithFallbackProps,
  ScanButtonProps,
} from './BarcodeScanner';
