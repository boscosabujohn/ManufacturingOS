'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

// ============================================================================
// Translation Types
// ============================================================================

export type TranslationKey = string;
export type TranslationParams = Record<string, string | number>;
export type TranslationNamespace = string;

export interface TranslationResource {
  [key: string]: string | TranslationResource;
}

export interface TranslationResources {
  [locale: string]: {
    [namespace: string]: TranslationResource;
  };
}

// ============================================================================
// Translation Key Structure
// ============================================================================

/**
 * Recommended translation key structure:
 *
 * namespace:section.subsection.key
 *
 * Example keys:
 * - common:buttons.submit
 * - common:buttons.cancel
 * - common:validation.required
 * - dashboard:metrics.totalOrders
 * - inventory:table.columns.sku
 * - orders:status.pending
 *
 * Namespaces:
 * - common: Shared UI elements (buttons, labels, validation)
 * - navigation: Menu items and navigation
 * - dashboard: Dashboard-specific text
 * - inventory: Inventory module
 * - orders: Orders module
 * - customers: Customers module
 * - reports: Reports module
 * - settings: Settings pages
 * - errors: Error messages
 */

// ============================================================================
// Default Translations (English)
// ============================================================================

export const DEFAULT_TRANSLATIONS: TranslationResources = {
  en: {
    common: {
      buttons: {
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        remove: 'Remove',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        confirm: 'Confirm',
        reset: 'Reset',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
        refresh: 'Refresh',
        download: 'Download',
        upload: 'Upload',
        print: 'Print',
        copy: 'Copy',
        paste: 'Paste',
        selectAll: 'Select All',
        clearAll: 'Clear All',
        showMore: 'Show More',
        showLess: 'Show Less',
        viewDetails: 'View Details',
        loading: 'Loading...',
        tryAgain: 'Try Again',
      },
      labels: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        date: 'Date',
        time: 'Time',
        status: 'Status',
        type: 'Type',
        category: 'Category',
        description: 'Description',
        notes: 'Notes',
        amount: 'Amount',
        quantity: 'Quantity',
        price: 'Price',
        total: 'Total',
        subtotal: 'Subtotal',
        tax: 'Tax',
        discount: 'Discount',
        created: 'Created',
        updated: 'Updated',
        createdBy: 'Created By',
        updatedBy: 'Updated By',
      },
      validation: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number',
        minLength: 'Must be at least {{min}} characters',
        maxLength: 'Must be no more than {{max}} characters',
        min: 'Must be at least {{min}}',
        max: 'Must be no more than {{max}}',
        pattern: 'Invalid format',
        unique: 'This value already exists',
        match: 'Values do not match',
        number: 'Must be a valid number',
        integer: 'Must be a whole number',
        positive: 'Must be a positive number',
        date: 'Please enter a valid date',
        futureDate: 'Date must be in the future',
        pastDate: 'Date must be in the past',
        url: 'Please enter a valid URL',
      },
      status: {
        active: 'Active',
        inactive: 'Inactive',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        completed: 'Completed',
        cancelled: 'Cancelled',
        inProgress: 'In Progress',
        onHold: 'On Hold',
        draft: 'Draft',
        published: 'Published',
        archived: 'Archived',
      },
      messages: {
        success: 'Operation completed successfully',
        error: 'An error occurred',
        saved: 'Changes saved',
        deleted: 'Item deleted',
        copied: 'Copied to clipboard',
        noResults: 'No results found',
        noData: 'No data available',
        confirmDelete: 'Are you sure you want to delete this item?',
        unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?',
        loading: 'Loading...',
        processing: 'Processing...',
        pleaseWait: 'Please wait...',
      },
      table: {
        showing: 'Showing {{from}} to {{to}} of {{total}} results',
        noData: 'No data to display',
        rowsPerPage: 'Rows per page',
        page: 'Page {{current}} of {{total}}',
        sortAsc: 'Sort ascending',
        sortDesc: 'Sort descending',
        filter: 'Filter',
        clearFilters: 'Clear filters',
        columns: 'Columns',
        selectRow: 'Select row',
        selectAll: 'Select all',
        actions: 'Actions',
      },
      time: {
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        thisWeek: 'This Week',
        lastWeek: 'Last Week',
        nextWeek: 'Next Week',
        thisMonth: 'This Month',
        lastMonth: 'Last Month',
        nextMonth: 'Next Month',
        thisYear: 'This Year',
        lastYear: 'Last Year',
        custom: 'Custom Range',
      },
    },
    navigation: {
      menu: {
        dashboard: 'Dashboard',
        inventory: 'Inventory',
        orders: 'Orders',
        customers: 'Customers',
        suppliers: 'Suppliers',
        production: 'Production',
        quality: 'Quality',
        reports: 'Reports',
        settings: 'Settings',
        help: 'Help',
        profile: 'Profile',
        logout: 'Logout',
      },
      breadcrumb: {
        home: 'Home',
      },
    },
    errors: {
      generic: 'Something went wrong',
      network: 'Network error. Please check your connection.',
      timeout: 'Request timed out. Please try again.',
      notFound: 'Page not found',
      unauthorized: 'You are not authorized to perform this action',
      forbidden: 'Access denied',
      serverError: 'Server error. Please try again later.',
      validation: 'Please fix the errors below',
      sessionExpired: 'Your session has expired. Please log in again.',
    },
  },
  es: {
    common: {
      buttons: {
        submit: 'Enviar',
        cancel: 'Cancelar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        add: 'Agregar',
        remove: 'Quitar',
        close: 'Cerrar',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        confirm: 'Confirmar',
        reset: 'Restablecer',
        search: 'Buscar',
        filter: 'Filtrar',
        export: 'Exportar',
        import: 'Importar',
        refresh: 'Actualizar',
        download: 'Descargar',
        upload: 'Subir',
        print: 'Imprimir',
        copy: 'Copiar',
        paste: 'Pegar',
        selectAll: 'Seleccionar Todo',
        clearAll: 'Limpiar Todo',
        showMore: 'Mostrar Más',
        showLess: 'Mostrar Menos',
        viewDetails: 'Ver Detalles',
        loading: 'Cargando...',
        tryAgain: 'Intentar de Nuevo',
      },
      validation: {
        required: 'Este campo es obligatorio',
        email: 'Por favor ingrese un correo electrónico válido',
        minLength: 'Debe tener al menos {{min}} caracteres',
        maxLength: 'Debe tener como máximo {{max}} caracteres',
      },
      messages: {
        success: 'Operación completada exitosamente',
        error: 'Ocurrió un error',
        saved: 'Cambios guardados',
        deleted: 'Elemento eliminado',
        noResults: 'No se encontraron resultados',
      },
    },
    navigation: {
      menu: {
        dashboard: 'Panel',
        inventory: 'Inventario',
        orders: 'Pedidos',
        customers: 'Clientes',
        suppliers: 'Proveedores',
        production: 'Producción',
        quality: 'Calidad',
        reports: 'Informes',
        settings: 'Configuración',
        help: 'Ayuda',
        profile: 'Perfil',
        logout: 'Cerrar Sesión',
      },
    },
    errors: {
      generic: 'Algo salió mal',
      network: 'Error de red. Por favor verifique su conexión.',
      notFound: 'Página no encontrada',
    },
  },
  fr: {
    common: {
      buttons: {
        submit: 'Soumettre',
        cancel: 'Annuler',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        add: 'Ajouter',
        remove: 'Retirer',
        close: 'Fermer',
        back: 'Retour',
        next: 'Suivant',
        previous: 'Précédent',
        confirm: 'Confirmer',
        search: 'Rechercher',
        filter: 'Filtrer',
        loading: 'Chargement...',
      },
      validation: {
        required: 'Ce champ est obligatoire',
        email: 'Veuillez entrer une adresse email valide',
      },
      messages: {
        success: 'Opération réussie',
        error: 'Une erreur est survenue',
        saved: 'Modifications enregistrées',
        noResults: 'Aucun résultat trouvé',
      },
    },
    navigation: {
      menu: {
        dashboard: 'Tableau de bord',
        inventory: 'Inventaire',
        orders: 'Commandes',
        customers: 'Clients',
        settings: 'Paramètres',
        logout: 'Déconnexion',
      },
    },
  },
  de: {
    common: {
      buttons: {
        submit: 'Absenden',
        cancel: 'Abbrechen',
        save: 'Speichern',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        add: 'Hinzufügen',
        close: 'Schließen',
        back: 'Zurück',
        next: 'Weiter',
        search: 'Suchen',
        loading: 'Laden...',
      },
      validation: {
        required: 'Dieses Feld ist erforderlich',
        email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      },
      messages: {
        success: 'Vorgang erfolgreich abgeschlossen',
        error: 'Ein Fehler ist aufgetreten',
        saved: 'Änderungen gespeichert',
      },
    },
    navigation: {
      menu: {
        dashboard: 'Dashboard',
        inventory: 'Inventar',
        orders: 'Bestellungen',
        customers: 'Kunden',
        settings: 'Einstellungen',
        logout: 'Abmelden',
      },
    },
  },
  zh: {
    common: {
      buttons: {
        submit: '提交',
        cancel: '取消',
        save: '保存',
        delete: '删除',
        edit: '编辑',
        add: '添加',
        close: '关闭',
        back: '返回',
        next: '下一步',
        search: '搜索',
        loading: '加载中...',
      },
      validation: {
        required: '此字段为必填项',
        email: '请输入有效的电子邮件地址',
      },
      messages: {
        success: '操作成功',
        error: '发生错误',
        saved: '更改已保存',
      },
    },
    navigation: {
      menu: {
        dashboard: '仪表板',
        inventory: '库存',
        orders: '订单',
        customers: '客户',
        settings: '设置',
        logout: '退出登录',
      },
    },
  },
  ja: {
    common: {
      buttons: {
        submit: '送信',
        cancel: 'キャンセル',
        save: '保存',
        delete: '削除',
        edit: '編集',
        add: '追加',
        close: '閉じる',
        back: '戻る',
        next: '次へ',
        search: '検索',
        loading: '読み込み中...',
      },
      validation: {
        required: 'この項目は必須です',
        email: '有効なメールアドレスを入力してください',
      },
      messages: {
        success: '操作が完了しました',
        error: 'エラーが発生しました',
        saved: '変更を保存しました',
      },
    },
    navigation: {
      menu: {
        dashboard: 'ダッシュボード',
        inventory: '在庫',
        orders: '注文',
        customers: '顧客',
        settings: '設定',
        logout: 'ログアウト',
      },
    },
  },
  ar: {
    common: {
      buttons: {
        submit: 'إرسال',
        cancel: 'إلغاء',
        save: 'حفظ',
        delete: 'حذف',
        edit: 'تعديل',
        add: 'إضافة',
        close: 'إغلاق',
        back: 'رجوع',
        next: 'التالي',
        search: 'بحث',
        loading: 'جاري التحميل...',
      },
      validation: {
        required: 'هذا الحقل مطلوب',
        email: 'يرجى إدخال بريد إلكتروني صالح',
      },
      messages: {
        success: 'تمت العملية بنجاح',
        error: 'حدث خطأ',
        saved: 'تم حفظ التغييرات',
      },
    },
    navigation: {
      menu: {
        dashboard: 'لوحة التحكم',
        inventory: 'المخزون',
        orders: 'الطلبات',
        customers: 'العملاء',
        settings: 'الإعدادات',
        logout: 'تسجيل الخروج',
      },
    },
  },
};

// ============================================================================
// Translation Context
// ============================================================================

interface TranslationContextValue {
  locale: string;
  namespaces: string[];
  t: (key: string, params?: TranslationParams, namespace?: string) => string;
  addTranslations: (locale: string, namespace: string, translations: TranslationResource) => void;
  hasKey: (key: string, namespace?: string) => boolean;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

// ============================================================================
// Translation Provider
// ============================================================================

export interface TranslationProviderProps {
  children: ReactNode;
  locale?: string;
  defaultNamespace?: string;
  resources?: TranslationResources;
  fallbackLocale?: string;
}

export function TranslationProvider({
  children,
  locale = 'en',
  defaultNamespace = 'common',
  resources = DEFAULT_TRANSLATIONS,
  fallbackLocale = 'en',
}: TranslationProviderProps) {
  const [translations, setTranslations] = useState<TranslationResources>(resources);

  // Get nested value from object using dot notation
  const getNestedValue = useCallback(
    (obj: TranslationResource | undefined, path: string): string | undefined => {
      if (!obj) return undefined;

      const keys = path.split('.');
      let current: TranslationResource | string | undefined = obj;

      for (const key of keys) {
        if (typeof current === 'object' && current !== null) {
          current = current[key] as TranslationResource | string | undefined;
        } else {
          return undefined;
        }
      }

      return typeof current === 'string' ? current : undefined;
    },
    []
  );

  // Main translation function
  const t = useCallback(
    (key: string, params?: TranslationParams, namespace?: string): string => {
      // Parse key for namespace (namespace:key format)
      let ns = namespace || defaultNamespace;
      let translationKey = key;

      if (key.includes(':')) {
        const [keyNs, keyPath] = key.split(':');
        ns = keyNs;
        translationKey = keyPath;
      }

      // Try current locale
      let value = getNestedValue(translations[locale]?.[ns], translationKey);

      // Fallback to fallback locale
      if (!value && locale !== fallbackLocale) {
        value = getNestedValue(translations[fallbackLocale]?.[ns], translationKey);
      }

      // Fallback to key itself
      if (!value) {
        value = key;
      }

      // Replace parameters
      if (params && value) {
        Object.entries(params).forEach(([param, paramValue]) => {
          value = value!.replace(new RegExp(`{{${param}}}`, 'g'), String(paramValue));
        });
      }

      return value;
    },
    [locale, translations, defaultNamespace, fallbackLocale, getNestedValue]
  );

  // Add translations dynamically
  const addTranslations = useCallback(
    (targetLocale: string, namespace: string, newTranslations: TranslationResource) => {
      setTranslations(prev => ({
        ...prev,
        [targetLocale]: {
          ...prev[targetLocale],
          [namespace]: {
            ...prev[targetLocale]?.[namespace],
            ...newTranslations,
          },
        },
      }));
    },
    []
  );

  // Check if key exists
  const hasKey = useCallback(
    (key: string, namespace?: string): boolean => {
      let ns = namespace || defaultNamespace;
      let translationKey = key;

      if (key.includes(':')) {
        const [keyNs, keyPath] = key.split(':');
        ns = keyNs;
        translationKey = keyPath;
      }

      const value = getNestedValue(translations[locale]?.[ns], translationKey);
      return value !== undefined;
    },
    [locale, translations, defaultNamespace, getNestedValue]
  );

  const namespaces = useMemo(
    () => Object.keys(translations[locale] || {}),
    [translations, locale]
  );

  const value = useMemo(
    () => ({
      locale,
      namespaces,
      t,
      addTranslations,
      hasKey,
    }),
    [locale, namespaces, t, addTranslations, hasKey]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

// ============================================================================
// useTranslation Hook
// ============================================================================

export function useTranslation(namespace?: string) {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  const { t: baseT, ...rest } = context;

  // Create a namespaced translation function
  const t = useCallback(
    (key: string, params?: TranslationParams): string => {
      // If key already has namespace, use it directly
      if (key.includes(':')) {
        return baseT(key, params);
      }
      // Otherwise, use the provided namespace
      return baseT(key, params, namespace);
    },
    [baseT, namespace]
  );

  return { t, ...rest };
}

// ============================================================================
// Trans Component (for JSX interpolation)
// ============================================================================

export interface TransProps {
  i18nKey: string;
  namespace?: string;
  params?: TranslationParams;
  components?: Record<string, ReactNode>;
  defaultValue?: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function Trans({
  i18nKey,
  namespace,
  params,
  components,
  defaultValue,
  as: Component = 'span',
  className = '',
}: TransProps) {
  const { t, hasKey } = useTranslation(namespace);

  const text = hasKey(i18nKey) ? t(i18nKey, params) : (defaultValue || i18nKey);

  // If no components to interpolate, return simple text
  if (!components) {
    return <Component className={className}>{text}</Component>;
  }

  // Parse and interpolate components
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // Match patterns like <0>text</0> or <link>text</link>
  const regex = /<(\w+)>(.*?)<\/\1>/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(remaining.slice(lastIndex, match.index));
    }

    const [, componentKey, content] = match;
    const component = components[componentKey];

    if (component && React.isValidElement(component)) {
      parts.push(React.cloneElement(component, { key: key++ }, content));
    } else {
      parts.push(content);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <Component className={className}>{parts}</Component>;
}

// ============================================================================
// Plural Component
// ============================================================================

export interface PluralProps {
  count: number;
  one: string;
  other: string;
  zero?: string;
  two?: string;
  few?: string;
  many?: string;
  className?: string;
}

export function Plural({
  count,
  one,
  other,
  zero,
  two,
  few,
  many,
  className = '',
}: PluralProps) {
  const { locale } = useTranslation();

  const rules = new Intl.PluralRules(locale);
  const rule = rules.select(count);

  let text: string;
  switch (rule) {
    case 'zero':
      text = zero || other;
      break;
    case 'one':
      text = one;
      break;
    case 'two':
      text = two || other;
      break;
    case 'few':
      text = few || other;
      break;
    case 'many':
      text = many || other;
      break;
    default:
      text = other;
  }

  // Replace {{count}} placeholder
  text = text.replace(/{{count}}/g, String(count));

  return <span className={className}>{text}</span>;
}

// ============================================================================
// Translation Debug Component
// ============================================================================

export interface TranslationDebugProps {
  showKeys?: boolean;
  highlightMissing?: boolean;
}

export function TranslationDebug({
  showKeys = false,
  highlightMissing = true,
}: TranslationDebugProps) {
  // This would wrap the app to show translation keys or highlight missing translations
  // Implementation depends on development mode detection
  return null;
}

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
};
