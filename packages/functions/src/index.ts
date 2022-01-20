import * as functions from "firebase-functions";
import fetch from "node-fetch";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

interface DeviceDocument {
  payload: {
    access_token: string
    play_album: string
    tile_id?: string
  } | undefined
  read_mode: boolean | undefined
  [key: string]: any
}

// From: https://developers.google.com/photos/library/reference/rest/v1/mediaItems#MediaItem
interface MediaItem {
  id: string,
  description: string,
  productUrl: string,
  baseUrl: string,
  mimeType: string,
  mediaMetadata: { 
    [key: string]: string
  }
  contributorInfo: { 
    [key: string]: string
  },
  filename: string
}

// From: https://developers.google.com/photos/library/reference/rest/v1/mediaItems/search#response-body
interface MediaItemSearchData {
  mediaItems?: MediaItem[]
  nextPageToken: string | undefined
}

export const deviceMFRC522 = functions.firestore.document("/devices/mfrc522").onUpdate(async (change, _) => {
  const newData = <DeviceDocument>(change.after.data());
  if (newData.payload === undefined) {
    return;
  }

  const {play_album, tile_id, access_token} = newData.payload;
  if (!tile_id) {
    console.error("no tile id present!");
    return;
  }

  let nextPageToken: string | undefined = undefined;
  const photoURLs: string[] = [];

  do {
    const photoList = await fetch("https://photoslibrary.googleapis.com/v1/mediaItems:search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        albumId: play_album,
        pageSize: 100,
        pageToken: nextPageToken,
      }),
    });
    const data: MediaItemSearchData = await photoList.json();
    data.mediaItems?.forEach((item) => {
      // Only add images
      if (item.mimeType.startsWith('image/'))
        photoURLs.push(item.baseUrl);
    });
    nextPageToken = data.nextPageToken;

    // Max document size limit is 1MB which is ~1000 photo media links
    if (photoURLs.length > 1000) break;
  } while (nextPageToken);

  // Update the tile document with all photo urls
  change.after.ref.collection("tiles").doc(`${tile_id}`).set({
    photos: photoURLs,
  })
      .catch((error) => {
        console.error("Error occured while writing photo urls", error);
      });

  const {payload, ...rest} = newData;
  change.after.ref.set({
    ...rest,
    read_mode: true,
  })
      .catch((error) => {
        console.error("Error occured while writing device document", error);
      });

  return;
});
