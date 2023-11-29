/**
 * @fileoverview Common TypeScript types
 */

/**
 * Shortcut link hint
 */
export enum ShortcutLinkHint {
  NONE = "none",
  DNS_PREFETCH = "dns-prefetch",
  PRECONNECT = "preconnect",
  PREFETCH = "prefetch",
  PRERENDER = "prerender"
}

/**
 * Shortcut metadata
 */
export interface ShortcutMetadata {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Shortcut title
   */
  title: string;

  /**
   * Shortcut icon URL
   */
  icon: string;

  /**
   * Shortcut link URL
   */
  link: string;

  /**
   * Shortcut link hint
   */
  linkHint: ShortcutLinkHint;
}

/**
 * Background cache entry
 */
export interface BackgroundCacheEntry {
  /**
   * Full-resolution base64-encoded image
   */
  full: string;
}

/**
 * Background metadata
 */
export interface BackgroundMetadata {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Millisecond Unix epoch of when the background was generated
   */
  generatedAt: number;

  /**
   * Photographer name
   */
  photographerName?: string;

  /**
   * Original photo link URL (e.g.: on a 3rd-party website)
   */
  link?: string;

  /**
   * Alternative text
   */
  alt: string;

  /**
   * Photo source URL
   */
  url: string;
}

/**
 * Background provider
 */
export enum BackgroundProvider {
  /**
   * Custom, user-provided background
   */
  CUSTOM = "custom",

  /**
   * Pexels API
   */
  PEXELS = "pexels",

  /**
   * Unsplash API
   */
  UNSPLASH = "unsplash"
}

/**
 * Background category
 */
export enum BackgroundCategory {
  NONE = "none",

  ABSTRACT = "abstract",
  ARCHITECTURE = "architecture",
  ART = "art",
  BIKES = "bikes",
  CARS = "cars",
  CITY = "city",
  CONCERT = "concert",
  FASHION = "fashion",
  FOOD = "food",
  FOREST = "forest",
  HISTORY = "history",
  LIQUID = "liquid",
  NATURE = "nature",
  NIGHT = "night",
  PARTY = "party",
  PATTERNS = "patterns",
  PEOPLE = "people",
  PETS = "pets",
  PLANES = "planes",
  PLANTS = "plants",
  SCHOOL = "school",
  SCIENCE = "science",
  SPACE = "space",
  SPORTS = "sports",
  TECHNOLOGY = "technology",
  TEXT = "text",
  TEXTURES = "textures",
  TRAINS = "trains",
  WEATHER = "weather",
  WILD_ANIMALS = "wild animals"
}

/**
 * Background settings
 */
export interface BackgroundSettings {
  /**
   * Background category
   */
  category: BackgroundCategory;

  /**
   * Background provider
   */
  provider: BackgroundProvider;

  /**
   * Previous background IDs
   */
  previousIDs: string[];

  /**
   * Background refresh duration (in milliseconds)
   *
   * Negative value indicates to never refresh
   */
  refreshAfter: number;

  /**
   * Current background metadata
   */
  metadata?: BackgroundMetadata;
}

/**
 * Global store
 */
export interface Store {
  /**
   * Store version
   *
   * @note Synced across devices
   */
  version: string;

  /**
   * Background settings
   *
   * @note Synced across devices
   */
  background: BackgroundSettings;

  /**
   * Background cache
   * * Keys: background IDs
   * * Values: background cache entries
   *
   * @note Not synced across devices
   */
  backgroundCache: Record<string, BackgroundCacheEntry>;

  /**
   * Shortcuts
   *
   * @note Synced across devices
   */
  shortcuts: ShortcutMetadata[];
}

/**
 * Local storage properties
 */
type LocalStoreProperties = "backgroundCache";

/**
 * Local storage store
 */
export type LocalStore = Pick<Store, LocalStoreProperties>;

/**
 * Synced global store
 */
export type SyncedStore = Omit<Store, LocalStoreProperties>;
