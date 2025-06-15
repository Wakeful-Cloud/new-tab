/**
 * @file Background helper
 */

// Imports
import {sample} from "lodash-es";
import {createApi as createUnsplashApi} from "unsplash-js";

import {PexelsClient} from "~/lib/pexels";
import {setStore, store} from "~/lib/store";
import {
  BackgroundCategory,
  BackgroundData,
  BackgroundProvider,
} from "~/lib/types";
import {createDataURL} from "~/lib/utils";

/**
 * Maximum number of previous backgrounds to track and cache
 */
const MAX_PREVIOUS_BACKGROUNDS = 250;

/**
 * Maximum number of attempts to find a background before giving up and throwing an error
 */
const MAX_ATTEMPTS = 100;

if (
  typeof import.meta.env.VITE_PEXELS_API_KEY === "undefined" ||
  typeof import.meta.env.VITE_UNSPLASH_ACCESS_KEY === "undefined"
) {
  throw new TypeError("Missing API keys!");
}

// Create clients
const pexelsApi = new PexelsClient(import.meta.env.VITE_PEXELS_API_KEY);

const unsplashApi = createUnsplashApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
});

/**
 * Generate a Pexels ID
 * @param raw Raw Pexels ID
 * @returns Normalized Pexels ID
 */
const generatePexelsID = (raw: number) => `pexels:${raw.toString(10)}`;

/**
 * Get a Pexels background
 * @param width Screen width
 * @param height Screen height
 * @returns Background
 */
const getPexelsBackground = async (width: number, height: number) => {
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    // Get the query
    const query =
      store.background!.category === BackgroundCategory.NONE
        ? sample(BackgroundCategory)!
        : store.background!.category;

    // Search for photos
    const searchRes = await pexelsApi.searchPhotos({
      orientation: "landscape",
      page: i,
      // eslint-disable-next-line camelcase
      per_page: 10,
      query,
    });

    // Get the first photo that hasn't been used recently
    const photo = searchRes.photos.find(
      currentPhoto =>
        !store.background!.previousIDs.includes(
          generatePexelsID(currentPhoto.id),
        ),
    );

    if (photo === undefined) {
      continue;
    }

    // Generate the photo URL
    const photoURL = new URL(photo.src.original);
    photoURL.searchParams.set("h", height.toString());
    photoURL.searchParams.set("w", width.toString());
    photoURL.searchParams.set("auto", "compress");
    photoURL.searchParams.set("cs", "tinysrgb");

    return {
      alt: photo.alt ?? `Pexels photo for ${store.background!.category} query`,
      generatedAt: new Date().getTime(),
      id: generatePexelsID(photo.id),
      link: photo.url,
      photographerName: photo.photographer,
      url: photoURL.toString(),
    } as BackgroundData;
  }

  throw new Error("Failed to find a photo!");
};

/**
 * Generate an Unsplash ID
 * @param raw Raw Unsplash ID
 * @returns Normalized Pexels ID
 */
const generateUnsplashID = (raw: string) => `unsplash:${raw}`;

/**
 * Get an Unsplash background
 * @param width Screen width
 * @param height Screen height
 * @returns Background
 */
const getUnsplashBackground = async (width: number, height: number) => {
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    // Get the query
    const query =
      store.background!.category === BackgroundCategory.NONE
        ? sample(BackgroundCategory)!
        : store.background!.category;

    // Search for photos
    const searchRes = await unsplashApi.search.getPhotos({
      orderBy: "relevant",
      orientation: "landscape",
      page: i,
      perPage: 10,
      plus: "none",
      query,
    });

    // Handle errors
    if (searchRes.errors !== undefined) {
      console.error(searchRes.errors);
      throw new Error(searchRes.errors[0]);
    }

    // Get the first photo that hasn't been used recently
    const photo = searchRes.response.results.find(
      result =>
        !store.background!.previousIDs.includes(generateUnsplashID(result.id)),
    );

    if (photo === undefined) {
      continue;
    }

    // Generate the photo URL
    const photoURL = new URL(photo.urls.raw);
    photoURL.searchParams.set("h", height.toString());
    photoURL.searchParams.set("w", width.toString());
    photoURL.searchParams.set("fit", "max");
    photoURL.searchParams.set("fm", "jpg");
    photoURL.searchParams.set("q", "90");

    return {
      alt:
        photo.alt_description ??
        `Unsplash photo for ${store.background!.category} query`,
      generatedAt: new Date().getTime(),
      id: generateUnsplashID(photo.id),
      link: photo.links.html,
      photographerName: photo.user.name,
      url: photoURL.toString(),
    } as BackgroundData;
  }

  throw new Error("Failed to find a photo!");
};

/**
 * Generate a new background
 * @param customBackgroundUrl Background URL (For `custom` provider only)
 */
export const generateBackground = async (customBackgroundUrl?: string) => {
  // Get screen resolution
  const {width} = window.screen;
  const {height} = window.screen;

  // Generate background
  let background: BackgroundData | undefined = undefined;

  switch (store.background!.provider) {
    case BackgroundProvider.CUSTOM: {
      // Get the url
      const url = customBackgroundUrl ?? store.background.background?.url;

      if (url === undefined) {
        throw new TypeError("Custom background URL was undefined!");
      }

      background = {
        alt: "Custom background",
        generatedAt: new Date().getTime(),
        id: "custom",
        url,
      };

      break;
    }

    case BackgroundProvider.PEXELS:
      background = await getPexelsBackground(width, height);

      break;

    case BackgroundProvider.UNSPLASH:
      background = await getUnsplashBackground(width, height);

      break;

    default:
      throw new TypeError(
        `Invalid background provider ${store.background!.provider}!`,
      );
  }

  if (background === undefined) {
    throw new Error("Failed to find a photo!");
  }

  // Generate previous IDs
  let previousIDs = Array.from(store.background?.previousIDs ?? []);
  previousIDs.unshift(background!.id);

  if (previousIDs.length > MAX_PREVIOUS_BACKGROUNDS) {
    previousIDs.slice(0, MAX_PREVIOUS_BACKGROUNDS);
  }

  previousIDs = Array.from(new Set(previousIDs));

  // Download the background
  const backgroundRes = await fetch(background.url, {
    credentials: "omit",
    method: "GET",
    referrerPolicy: "no-referrer",
  });

  // Handle errors
  if (!backgroundRes.ok) {
    console.error(backgroundRes);
    throw new Error(backgroundRes.statusText);
  }

  // Update the background
  const blob = await backgroundRes.blob();
  background.url = await createDataURL(blob);

  // Update the store
  setStore({
    ...store,
    background: {
      ...store.background!,
      background,
      previousIDs,
    },
  });
};
