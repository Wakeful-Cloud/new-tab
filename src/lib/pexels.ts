/**
 * @file Pexels API client
 */

/**
 * Photo metadata
 * @see https://www.pexels.com/api/documentation/#photos-overview
 */
export interface PhotoMetadata {
  /**
   * The id of the photo.
   */
  id: number;

  /**
   * The real width of the photo in pixels.
   */
  width: number;

  /**
   * The real height of the photo in pixels.
   */
  height: number;

  /**
   * The Pexels URL where the photo is located.
   */
  url: string;

  /**
   * The name of the photographer who took the photo.
   */
  photographer: string;

  /**
   * The URL of the photographer's Pexels profile.
   */
  photographer_url: string;

  /**
   * The id of the photographer.
   */
  photographer_id: number;

  /**
   * The average color of the photo. Useful for a placeholder while the image loads.
   */
  avg_color: string;

  /**
   * An assortment of different image sizes that can be used to display this `Photo`.
   */
  src: {
    /**
     * The image without any size changes. It will be the same as the `width` and `height` attributes.
     */
    original: string;

    /**
     * The image resized to `W 940px X H 650px DPR 1`.
     */
    large: string;

    /**
     * The image resized `W 940px X H 650px DPR 2`.
     */
    large2x: string;

    /**
     * The image scaled proportionally so that it's new height is `350px`.
     */
    medium: string;

    /**
     * The image scaled proportionally so that it's new height is `130px`.
     */
    small: string;

    /**
     * The image cropped to `W 800px X H 1200px`.
     */
    portrait: string;

    /**
     * The image cropped to `W 1200px X H 627px`.
     */
    landscape: string;

    /**
     * The image cropped to `W 280px X H 200px.`
     */
    tiny: string;
  };

  /**
   * Text description of the photo for use in the `alt` attribute.
   */
  alt: string;
}

/**
 * Photo search parameters
 * @see https://www.pexels.com/api/documentation/#photos-search__parameters
 */
export interface SearchParameters {
  /**
   * The search query. `Ocean`, `Tigers`, `Pears`, etc.
   */
  query: string;

  /**
   * Desired photo orientation
   */
  orientation?: "landscape" | "portrait" | "square";

  /**
   * Minimum photo size. The current supported sizes are:
   * `large`: `24MP`
   * `medium`: `12MP`
   * `small`: `4MP`
   */
  size?: "large" | "medium" | "small";

  /**
   * Desired photo color. Also supports any hexidecimal color code (eg. `#ffffff`).
   */
  color?:
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "turquoise"
    | "blue"
    | "violet"
    | "pink"
    | "brown"
    | "black"
    | "gray"
    | "white"
    | string;

  /**
   * The locale of the search you are performing.
   */
  locale?:
    | "en-US"
    | "pt-BR"
    | "es-ES"
    | "ca-ES"
    | "de-DE"
    | "it-IT"
    | "fr-FR"
    | "sv-SE"
    | "id-ID"
    | "pl-PL"
    | "ja-JP"
    | "zh-TW"
    | "zh-CN"
    | "ko-KR"
    | "th-TH"
    | "nl-NL"
    | "hu-HU"
    | "vi-VN"
    | "cs-CZ"
    | "da-DK"
    | "fi-FI"
    | "uk-UA"
    | "el-GR"
    | "ro-RO"
    | "nb-NO"
    | "sk-SK"
    | "tr-TR"
    | "ru-RU";

  /**
   * The page number you are requesting.
   * @default `1`
   */
  page?: number;

  /**
   * The number of results you are requesting per page. Maximum: `80`.
   * @default `15`
   */
  per_page?: number;
}

/**
 * Photo search response
 * @see https://www.pexels.com/api/documentation/#photos-search__response
 */
export interface SearchResponse {
  /**
   * An array of `Photo` objects.
   */
  photos: PhotoMetadata[];

  /**
   * The current page number.
   */
  page: number;

  /**
   * The number of results returned with each page.
   */
  per_page: number;

  /**
   * The total number of results for the request.
   */
  total_results: number;

  /**
   * URL for the previous page of results, if applicable.
   */
  prev_page?: string;

  /**
   * URL for the next page of results, if applicable.
   */
  next_page?: string;
}

/**
 * Pexels API client
 */
export class PexelsClient {
  /**
   * Create a new Pexels API client
   * @param apiKey Pexels API key
   */
  constructor(
    /**
     * Pexels API key
     */
    private apiKey: string,
  ) {}

  /**
   * Fetch from the Pexels API
   * @template T Expected response type
   * @param path API relative path
   * @param parameters Query parameters
   * @param init Fetch init
   * @returns Response JSON
   */
  private async fetchPexels<T>(
    path: string,
    parameters: Record<string, any>,
    init?: RequestInit,
  ): Promise<T> {
    // Generate the URL
    const reqUrl = new URL(path, "https://api.pexels.com");

    // Add query parameters
    for (const [key, value] of Object.entries(parameters)) {
      reqUrl.searchParams.set(key, value.toString());
    }

    // Make the request
    const res = await fetch(reqUrl, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: this.apiKey,
      },
    });

    // Handle errors
    if (res.status < 200 || res.status >= 300) {
      // Get the body
      const body = await res.text();

      throw new Error(
        `Pexels API returned status code: ${res.status} and body: ${body}`,
      );
    }

    // Parse the response
    const json = await res.json();

    return json;
  }

  /**
   * Search for photos
   * @param parameters Search parameters
   * @returns Search response
   */
  public async searchPhotos(
    parameters: SearchParameters,
  ): Promise<SearchResponse> {
    const res = await this.fetchPexels<SearchResponse>(
      "/v1/search",
      parameters,
    );

    return res;
  }
}
