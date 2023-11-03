
import { Component } from 'react';
import SignIn from './Component/SignIn/Signin';
import Navigation from './Component/Navigation/Navigation';
import Logo from './Component/Logo/Logo';
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import Rank from './Component/Rank/Rank';
import Register from './Component/Register/Register';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './Component/FaceRecognition/FaceRecognition';
import './App.css';

// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'f7dce7228f4e45ecbad7850fb1b34fa5';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'aqwi2vvmdyu5';
const APP_ID = 'FaceApp';
// Change these to whatever model and image URL you want to use
// const MODEL_ID = 'general-english-image-caption-clip'; 



const returnClarifaiRequestoptions = (imageURL) => {
  const IMAGE_URL = imageURL;
  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  return requestOptions
}




class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageURL: "",
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  // calculateFaceLocation2 = (clarifaiFace,iwidth,iheight) => {

  // }
  calculateFaceLocation = (data) => {

    // for (let i=0 ; i<(data.outputs[0].data.regions.length) ;i++){
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const iwidth = Number(image.width);
    const iheight = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * iwidth,
      topRow: clarifaiFace.top_row * iheight,
      rightCol: iwidth - (clarifaiFace.right_col * iwidth),
      bottomRow: iheight - (clarifaiFace.bottom_row * iheight)
    }
    //  return this.calculateFaceLocation2(clarifaiFace,iwidth,iheight);
    // }
  }

  displayFaceBox = (box) => {

    this.setState({ box: box });

  }

  displayCaption = (data) => {
    let captionField = document.getElementById("caption-field");
    captionField.style.display = "block";
    let caption = data.outputs[0].data.text.raw;
    // console.log(caption.charAt(0).toUpperCase() + caption.slice(1));
    captionField.value = caption.charAt(0).toUpperCase() + caption.slice(1);

  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
    let captionField = document.getElementById("caption-field");
    let displayBox = document.getElementById("box");
    displayBox.style.display = "none";
    captionField.value = " ";

  }

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });

    let displayBox = document.getElementById("box");
    displayBox.style.display = "block";
    // console.log("click");
    // eslint-disable-next-line
    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequestoptions(input))
      .then(response => response.json())

      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(error => console.log('error', error));



  }

  onButtonGenerate = () => {
    this.setState({ imageURL: this.state.input });

    let displayBox = document.getElementById("box");
    displayBox.style.display = "none";
    // console.log("click generate");
    // eslint-disable-next-line
    fetch("https://api.clarifai.com/v2/models/" + 'general-english-image-caption-clip' + "/outputs", returnClarifaiRequestoptions(input))
      .then(response => response.json())
      .then(response => this.displayCaption(response))
      .catch(error => console.log('error', error));

  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }


  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (

      <div className="App">
        <ParticlesBg type="cobweb" bg={true} color='#FFFFFF' num={80} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div> <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
              onButtonGenerate={this.onButtonGenerate}
            />
            <FaceRecognition box={box} imageURL={imageURL} />
          </div>
          : (route === 'signin'
            ? <SignIn onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
          )
        }

      </div>
    )
  };
}

export default App;
