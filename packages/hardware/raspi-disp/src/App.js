import React, { Component } from "react";
import "./styles.css";

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
      index: 0
    }

    this.animate = this.animate.bind(this)
  }

  componentDidMount() {
    setInterval(() => {
      this.animate()
    }, 5000);
  }

  animate() {
    console.log("animate")
    if (index >= 0 && index < img_urls.length - 1) {
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
          backgroundImage: `url(${img_urls[index]})`
        }}>
        </div>
      </div>
    );
  }
}
export default App;
