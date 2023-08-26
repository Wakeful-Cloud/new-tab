/**
 * @fileoverview Miscellaneous utilities
 */

/**
 * Create a data URL for the blob
 * @param raw Raw blob
 * @returns Data URL
 */
export const createDataURL = async (raw: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(raw);

  await new Promise(resolve =>
    reader.addEventListener("load", resolve, {
      once: true
    })
  );

  return reader.result as string;
};
