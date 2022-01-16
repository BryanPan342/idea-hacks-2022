import React, { Component } from "react";
import { getFirestore, doc, onSnapshot, getDoc } from "firebase/firestore";
import "./styles.css";
import app from 'firebase/compat/app'

if (!app.apps.length) {
  app.initializeApp({
    apiKey: "AIzaSyCgeY9tB_-okdEw18DWw44WwoPr4SHUfsc",
    authDomain: "idea-hacks-2022.firebaseapp.com",
    databaseURL: "https://idea-hacks-2022.firebaseio.com/",
    projectId: "idea-hacks-2022",
    storageBucket: "idea-hacks-2022.appspot.com",
    messagingSenderId: "14411425444",
    appId: "1:14411425444:web:9e455baef0e1c20b34a831",
  })
}

const img_urls = [
  "https://th.bing.com/th/id/R.748e221d731238dabc5ad6ea5412a4b7?rik=F69NxpqKmP2tmQ&riu=http%3a%2f%2fwallpapercave.com%2fwp%2f0pMys4b.jpg&ehk=WaL0UxWMCtEUkQQlLbDbQM7lifP3Y9NhnIh1JcSSv5Q%3d&risl=&pid=ImgRaw&r=0",
  "https://www.solidbackgrounds.com/download/2560x1440-winter-tree-on-a-cold-winter-day-free-website-background-image.jpg",
  "https://th.bing.com/th/id/R.2cf0cce180d665e275d8fe5b05e61dd9?rik=H69hw63TyWh%2fkw&pid=ImgRaw&r=0",
  "https://th.bing.com/th/id/OIP.MaG90P4LHR9sm04MNq_OZwHaEo?pid=ImgDet&rs=1",
  "https://getwallpapers.com/wallpaper/full/0/3/1/1377053-free-download-cool-tree-backgrounds-2560x1440-for-hd.jpg"
]
var index = 0;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      recentTileId: 0,
      imgUrls: img_urls,
    }

    this.animate = this.animate.bind(this)
  }

  componentDidMount() {
    setInterval(() => {
      this.animate()
    }, 5000);

    const main = async () => {
      const db = getFirestore();
      const docRef = doc(db, "devices", "mfrc522");

      onSnapshot(docRef, async (item) => {
        console.log("Current data: ", item.data());

        const recentTileId = item.data()['recent_tile_id']
        console.log(recentTileId)
        if (this.state.recentTileId !== recentTileId) {
          // get new images
          const tileDocRef = doc(db, "devices", "mfrc522", "tiles", `${recentTileId}`);
          const tileDocSnap = await getDoc(tileDocRef);
          const arrImages = tileDocSnap.data().photos;
          console.log(arrImages);

          this.setState({
            recentTileId: recentTileId,
            imgUrls: arrImages
          })
        }
      })
    }
    main()
  }

  animate() {
    console.log("animate")
    if (index >= 0 && index < this.state.imgUrls.length - 1) {
      index++;
    }
    else {
      index = 0;
    }

    this.setState({
      index: index
    })
  };

  render() {
    return (
      <div id="curtain" >
        <div id="container" style={{
          backgroundImage: `url(${this.state.imgUrls[index]})`
        }}>
        </div>
      </div>
    );
  }
}
export default App;
