import * as functions from "firebase-functions";
import fetch from "node-fetch";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

interface DeviceDocument {
  payload: {
    access_token: string
    play_album: string
    tile_id?: string | number
  } | undefined
  read_mode: boolean | undefined
  [key: string]: any
}

interface MediaItemSearchData {
  mediaItems?: [
    {
      [key: string]: string
    }
  ]
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
    const data = <MediaItemSearchData>(await photoList.json());
    data.mediaItems?.forEach((item) => {
      photoURLs.push(item.baseUrl);
    });
    nextPageToken = data.nextPageToken;

    // Max allowed document size if 1MB which is ~1400 urls
    if (photoURLs.length > 1200) {
      break;
    }
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
