import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function App(): JSX.Element {

  useEffect(() => {
    //signOut();
    configureGoogleSignIn();
    login();
  }, []);


  function configureGoogleSignIn() { //It is mandatory to call this method before attempting to call signIn()
    GoogleSignin.configure({
      scopes: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/photoslibrary",
      ],
      iosClientId: '14411425444-a7fjpnkqkake6m8vf9ii0fnnn35tg76u.apps.googleusercontent.com',// ios client id from google console
      offlineAccess: false,
      hostedDomain: '',
      accountName: ''
    });
  }

  const login = async () => { //function to sign in google account
    try {
      await GoogleSignin.hasPlayServices(
        { showPlayServicesUpdateDialog: true }
      );

      const userInfo = await GoogleSignin.signIn();
      const user = await GoogleSignin.addScopes({
        scopes: [
          "openid",
          "email",
          "profile",
          "https://www.googleapis.com/auth/photoslibrary",
        ]
      });
      console.log(user);
      const token = await GoogleSignin.getTokens();
      console.log(token);
      getGooglePhotos(token.accessToken);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
        console.log('cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        console.log('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play services not available or outdated');
      } else {
        console.log(error.toString());
      }
    }
  }

  const signOut = async () => { // function used to sign out
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      return true;
    } catch (error) {
      console.error(error);
    }

  };

  async function getGooglePhotos (accessToken: string, nextPageToken = null) { //function to get photos after login

    let url = "";
    if (nextPageToken) {
      url = "https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=25&pageToken=" + nextPageToken;
    }
    else {
      url = "https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=25";
    }

    return await fetch(url,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        },
      })
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log(responseJson);
        if (responseJson.mediaItems && responseJson.mediaItems.length > 0) {
          let newArray: any[] = [];
          responseJson.mediaItems.map((asset: any) => {
            let type = asset.mimeType.split('/')[0];
            if (type == 'video') {
              getGooglePhotos(accessToken, responseJson.nextPageToken);
            }
            if (type == 'image') {
              newArray.push(asset);
            }
          });

          var photos = newArray.map((asset) => {
            let type = asset.mimeType.split('/')[0];
            return { ...asset, doc_path: asset.baseUrl };
          });

          console.log(photos);
        }
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  }


  return (
    <View>
      <Text>
        Nice cock.
      </Text>
    </View>
  );
}
