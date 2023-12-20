
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

const initialState = {
  input: "",
  imageURL: "",
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''

  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }


loadUser = (data) => {
  this.setState({
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }
  })
}
// componentDidMount() {
//   fetch('http://localhost:3000/')
//     .then(response => response.json())
//     .then(console.log)
// }
// calculateFaceLocation2 = (clarifaiFace,iwidth,iheight) => {

// }
calculateFaceLocation = (data) => {

  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById("inputimage");
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }

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
  fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequestoptions(this.state.input))
    .then(response => response.json())
    .then(response => {
      console.log('hi', response)
      if (response) {
        fetch('https://smart-brain-recognition.onrender.com//image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(console.log)

      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
}

onButtonGenerate = () => {
  this.setState({ imageURL: this.state.input });

  let displayBox = document.getElementById("box");
  let captionField = document.getElementById("caption-field");
  displayBox.style.display = "none";
  captionField.value = "Loading ...";
  // eslint-disable-next-line
  fetch("https://api.clarifai.com/v2/models/" + 'general-english-image-caption-clip' + "/outputs", returnClarifaiRequestoptions(this.state.input))
    .then(response => response.json())
    .then(response => this.displayCaption(response))
    .then(count => {
      this.setState(Object.assign(this.state.user, { entries: count }))
    })
    .catch(error => console.log('error', error));

}

onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
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
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
            onButtonGenerate={this.onButtonGenerate}
          />
          <FaceRecognition box={box} imageURL={imageURL} />
        </div>
        : (route === 'signin'
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
      }

    </div>
  )
};
}

export default App;
