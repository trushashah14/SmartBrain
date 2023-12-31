import React from "react";

const Navigation = ({ onRouteChange, isSignedIn }) => {

    if (isSignedIn) {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p onClick={() => onRouteChange('signout')} className='f4 link dim black underline pa3 pointer'><strong>Sign Out</strong></p>
            </nav>
        );
    } else {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p onClick={() => onRouteChange('signin')} className='f4 link dim black underline pa3 pointer'><strong>Sign In</strong></p>
                <p onClick={() => onRouteChange('register')} className='f4 link dim black underline pa3 pointer'><strong>Register</strong></p>
            </nav>
        );

    }

}



export default Navigation;