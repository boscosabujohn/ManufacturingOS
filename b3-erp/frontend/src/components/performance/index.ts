// Performance & Loading Components
// Feature 27: Loading optimization and performance monitoring

// Lazy Loading - Code splitting utilities
export {
  createLazyComponent,
  LazyLoadWrapper,
  createLazyRoutes,
  PreloadLink,
  useDynamicImport,
  LazyOnView,
  modulePreloader,
  preloadRoute,
  preloadImage,
  preloadScript,
  PageTransition,
} from './LazyLoad';
export type {
  LazyLoadOptions,
  LazyLoadWrapperProps,
  RouteConfig,
  PreloadLinkProps,
  UseDynamicImportResult,
  LazyOnViewProps,
  PageTransitionProps,
} from './LazyLoad';

// Skeleton Loaders - Consistent shimmer effect
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonTable,
  SkeletonListItem,
  SkeletonList,
  SkeletonFormField,
  SkeletonForm,
  SkeletonDashboard,
  SkeletonPage,
  SkeletonWrapper,
} from './Skeleton';
export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonButtonProps,
  SkeletonCardProps,
  SkeletonTableProps,
  SkeletonListItemProps,
  SkeletonListProps,
  SkeletonFormFieldProps,
  SkeletonFormProps,
  SkeletonDashboardProps,
  SkeletonPageProps,
  SkeletonWrapperProps,
} from './Skeleton';

// Progressive Loading - Show available data immediately
export {
  useProgressiveLoad,
  ProgressiveLoad,
  useStaggeredLoad,
  StaggeredList,
  ProgressiveImage,
  ContentPlaceholder,
  LoadingProgressBar,
} from './ProgressiveLoad';
export type {
  LoadingPhase,
  ProgressiveData,
  UseProgressiveLoadOptions,
  ProgressiveLoadProps,
  UseStaggeredLoadOptions,
  UseStaggeredLoadResult,
  StaggeredListProps,
  ProgressiveImageProps,
  ContentPlaceholderProps,
  LoadingProgressBarProps,
} from './ProgressiveLoad';

// Optimized Images - Lazy loading with blur-up effect
export {
  OptimizedImage,
  ResponsiveImage,
  AvatarImage,
  BackgroundImage,
  ImageGallery,
} from './OptimizedImage';
export type {
  ImageFit,
  ImagePosition,
  OptimizedImageProps,
  ImageSource,
  ResponsiveImageProps,
  AvatarImageProps,
  BackgroundImageProps,
  GalleryImage,
  ImageGalleryProps,
} from './OptimizedImage';

// Bundle Analysis - Monitor and reduce bundle size
export {
  usePerformanceMonitor,
  PerformanceDashboard,
  BundleSizeWarning,
  generatePerformanceReport,
} from './BundleAnalysis';
export type {
  PerformanceMetrics,
  ResourceMetric,
  UsePerformanceMonitorOptions,
  PerformanceDashboardProps,
  BundleSizeWarningProps,
} from './BundleAnalysis';
