import React from "react";
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit, onButtonGenerate }) => {
    return (
        <div>
            <p className="f3">
                <strong> {'This Magic Brain will detect faces in your pictures OR generate picture captions.Give it a Try!'}</strong>
            </p>
            <div className="center">
                <div className="form  pa3 br3 shadow-3">
                    <input className="f4 pa2 w-90 br3" type="text" onChange={onInputChange} />
                    <button className="w-45 tc grow f5 br3 link ph3 pv2 black bg-light-brown" onClick={onButtonSubmit}> <strong>Face-Detection</strong></button>
                    <strong> OR </strong>
                    <button className="w-45 tc grow f5 br3 link ph3 pv2 black bg-light-brown" onClick={onButtonGenerate}> <strong>Generate-Picture-Caption</strong></button>
                </div>
               
            </div>
            <strong><input id="caption-field" className="center item1 f4 pa2 w-70 br4 b " style={{ display: "none" }} type="text"></input></strong>
          

        </div>
    );
}



export default ImageLinkForm;