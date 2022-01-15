import React, { Component, useEffect } from 'react';
import { view } from 'react-native'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function App(): JSX.Element {

  useEffect(() => {
    configureGoogleSignIn();

  }, []);


  function configureGoogleSignIn() { //It is mandatory to call this method before attempting to call signIn()
    GoogleSignin.configure({
      scopes: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/photoslibrary",
      ],
      androidClientId: ANDROID_CLIENT_ID,//your android client id from google console
      iosClientId: IOS_CLIENT_ID,// ios client id from google console
      offlineAccess: false,
      hostedDomain: '',
      accountName: ''
    });
  }

  googleLogin = async (type) => { //function to sign in google account

    try {

      await GoogleSignin.hasPlayServices(

        { showPlayServicesUpdateDialog: true }

      );

      const userInfo = await GoogleSignin.signIn();

      const token = await GoogleSignin.getTokens();

      this.setState({ accessToken: token.accessToken });

      this.getGooglePhotos(token.accessToken);

    } catch (error) {

      console.log("error in  singin ");

      console.log(error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {

        // sign in was cancelled

        console.log('cancelled');

      } else if (error.code === statusCodes.IN_PROGRESS) {

        // operation in progress already

        console.log('in progress');

      }

      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {

        console.log('play services not available or outdated');

      } else {

        console.log('Something went wrong');

        console.log(error.toString());

      }

    }

  }

  signOut = async () => { // function used to sign out

    try {

      await GoogleSignin.revokeAccess();

      await GoogleSignin.signOut();

      return true;

    } catch (error) {

      console.error(error);

    }

  };

  async getGooglePhotos(accessToken, nextPageToken = null) { //function to get photos after login

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

        if (responseJson.mediaItems && responseJson.mediaItems.length > 0) {

          let newArray = [];

          responseJson.mediaItems.map((asset) => {

            let type = asset.mimeType.split('/')[0];

            if (type == 'video') {

              this.getGooglePhotos(this.state.accessToken, responseJson.nextPageToken);

            }

            if (type == 'image') {

              newArray.push(asset);

            }

          });

          var photos = newArray.map((asset) => {

            let type = asset.mimeType.split('/')[0];

            return { ...asset, doc_path: asset.baseUrl };

          });

          this.setState({

            data: [...this.state.data, ...photos], nextGoooglePageToken: responseJson.nextPageToken
          })

        }

      })

      .catch((error) => {

        console.log("in a catch ");

        console.error(error);

        return error;

      });

    render(){

      return (

        {

          if(this.state.nextGoooglePageToken)

 {

        this.getGooglePhotos(this.state.googleAccessToken, this.state.nextGoooglePageToken);

      }

    }
  }

  onEndReachedThreshold = { 0.1}

  renderItem = {({ item, index }) => {

    return (

      <View key={index}>

        <ImageBackground

          style={{

            padding: 10,

            height: 131,

            alignItems: 'flex-end',

            justifyContent: 'flex-start',

          }}

          resizeMode='cover' source={{ uri: (item.image_thumbnail_path && item.image_thumbnail_path != '') ? item.image_thumbnail_path : item.doc_path }}>

        </ImageBackground>

      </View>

    )

  }

}

/>

)

}

   }

}
