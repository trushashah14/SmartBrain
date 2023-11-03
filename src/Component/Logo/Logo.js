import Brain from './Brain.png';
import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css';

const Logo = () => {
    return (
        <div className="ma4 mt0 center">
            <Tilt className="Tilt br2" scale={1.2} transitionSpeed={500} style={{ height: 100, width: 100 }}>
                <div className="Tilt-inner">
                    <img src={Brain} alt='Brain logo'></img></div>
            </Tilt>
        </div>
    );
}


export default Logo;