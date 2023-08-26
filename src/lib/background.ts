/* eslint-disable camelcase */
/**
 * @fileoverview Background helper
 */

//Imports
import {sample} from "lodash-es";
import {createApi as createUnsplashApi} from "unsplash-js";
import {PexelsClient} from "~/lib/pexels";
import {setSettings, settings} from "~/lib/store";
import {
  BackgroundCategory,
  BackgroundMetadata,
  BackgroundProvider
} from "~/lib/types";
import {createDataURL} from "~/lib/utils";

/**
 * Maximum number of previous IDs to store
 */
const MAX_PREVIOUS_IDS = 250;

if (
  typeof import.meta.env.VITE_PEXELS_API_KEY === "undefined" ||
  typeof import.meta.env.VITE_UNSPLASH_ACCESS_KEY === "undefined"
) {
  throw new TypeError("Missing API keys!");
}

//Create clients
const pexelsApi = new PexelsClient(import.meta.env.VITE_PEXELS_API_KEY);
const unsplashApi = createUnsplashApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY
});

/**
 * Generate a Pexels ID
 * @param raw Raw Pexels ID
 * @returns Normalized Pexels ID
 */
const generatePexelsID = (raw: number) => `pexels:${raw.toString(10)}`;

/**
 * Generate an Unsplash ID
 * @param raw Raw Unsplash ID
 * @returns Normalized Pexels ID
 */
const generateUnsplashID = (raw: string) => `unsplash:${raw}`;

/**
 * Generate a new background
 * @param customBackgroundUrl Background URL (For `custom` provider only)
 */
export const generateBackground = async (customBackgroundUrl?: string) => {
  //Get screen resolution
  const width = window.screen.width;
  const height = window.screen.height;

  //Generate background metadata
  let metadata: BackgroundMetadata | undefined = undefined;
  switch (settings.background!.provider) {
    case BackgroundProvider.CUSTOM: {
      //Get the url
      const url = customBackgroundUrl ?? settings.background.metadata?.url;

      if (url === undefined) {
        throw new TypeError("Custom background URL was undefined!");
      }

      metadata = {
        id: "custom",
        generatedAt: new Date().getTime(),
        alt: "Custom background",
        url
      };
      break;
    }

    case BackgroundProvider.PEXELS:
      for (let i = 0; i < 100; i++) {
        //Get the query
        const query =
          settings.background!.category === BackgroundCategory.NONE
            ? sample(BackgroundCategory)!
            : settings.background!.category;

        //Search for photos
        const searchRes = await pexelsApi.searchPhotos({
          orientation: "landscape",
          page: i,
          per_page: 10,
          query
        });

        //Get the first photo that hasn't been used recently
        const photo = searchRes.photos.find(
          photo =>
            !settings.background!.previousIDs.includes(
              generatePexelsID(photo.id)
            )
        );

        if (photo === undefined) {
          continue;
        }

        //Generate the photo URL
        const photoURL = new URL(photo.src.original);
        photoURL.searchParams.set("h", height.toString());
        photoURL.searchParams.set("w", width.toString());
        photoURL.searchParams.set("auto", "compress");
        photoURL.searchParams.set("cs", "tinysrgb");

        //Download the photo
        const photoRes = await fetch(photoURL, {
          credentials: "omit",
          method: "GET",
          referrerPolicy: "no-referrer"
        });

        //Handle errors
        if (!photoRes.ok) {
          console.error(photoRes);
          throw new Error(photoRes.statusText);
        }

        //Convert to a data URL
        const blob = await photoRes.blob();
        const dataURL = await createDataURL(blob);

        metadata = {
          id: generatePexelsID(photo.id),
          generatedAt: new Date().getTime(),
          photographerName: photo.photographer,
          alt:
            photo.alt ??
            `Pexels photo for ${settings.background!.category} query`,
          link: photo.url,
          url: dataURL
        };
        break;
      }
      break;

    case BackgroundProvider.UNSPLASH:
      for (let i = 0; i < 100; i++) {
        //Get the query
        const query =
          settings.background!.category === BackgroundCategory.NONE
            ? sample(BackgroundCategory)!
            : settings.background!.category;

        //Search for photos
        const searchRes = await unsplashApi.search.getPhotos({
          orderBy: "relevant",
          orientation: "landscape",
          page: i,
          perPage: 10,
          plus: "none",
          query
        });

        //Handle errors
        if (searchRes.errors !== undefined) {
          console.error(searchRes.errors);
          throw new Error(searchRes.errors[0]);
        }

        //Get the first photo that hasn't been used recently
        const photo = searchRes.response.results.find(
          result =>
            !settings.background!.previousIDs.includes(
              generateUnsplashID(result.id)
            )
        );

        if (photo === undefined) {
          continue;
        }

        //Generate the photo URL
        const photoURL = new URL(photo.urls.raw);
        photoURL.searchParams.set("h", height.toString());
        photoURL.searchParams.set("w", width.toString());
        photoURL.searchParams.set("fit", "max");
        photoURL.searchParams.set("fm", "jpg");
        photoURL.searchParams.set("q", "90");

        //Download the photo
        const photoRes = await fetch(photoURL, {
          credentials: "omit",
          method: "GET",
          referrerPolicy: "no-referrer"
        });

        //Handle errors
        if (!photoRes.ok) {
          console.error(photoRes);
          throw new Error(photoRes.statusText);
        }

        //Convert to a data URL
        const blob = await photoRes.blob();
        const dataURL = await createDataURL(blob);

        metadata = {
          id: generateUnsplashID(photo.id),
          generatedAt: new Date().getTime(),
          photographerName: photo.user.name,
          alt:
            photo.alt_description ??
            `Unsplash photo for ${settings.background!.category} query`,
          link: photo.links.html,
          url: dataURL
        };
        break;
      }
      break;

    default:
      throw new TypeError(
        `Invalid background provider ${settings.background!.provider}!`
      );
  }

  if (metadata === undefined) {
    throw new Error("Failed to find a photo!");
  }

  //Generate previous IDs
  let previousIDs = Array.from(settings.background?.previousIDs ?? []);
  previousIDs.unshift(metadata!.id);
  if (previousIDs.length > MAX_PREVIOUS_IDS) {
    previousIDs.slice(0, MAX_PREVIOUS_IDS);
  }
  previousIDs = Array.from(new Set(previousIDs));

  //Update settings
  setSettings({
    ...settings,
    background: {
      ...settings.background!,
      previousIDs,
      metadata
    }
  });
};
