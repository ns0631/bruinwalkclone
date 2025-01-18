import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

function Logout() {
    const [loaded, setLoaded] = useState(false);

    useEffect( () => {
        if(Cookies.get("email")){
            Cookies.remove("email");
        }
        setLoaded(true);
    }, [] );

    if(loaded){
        return (
            <>
              <Navigate to="/" />
            </>
        );
    } else{
        return (
            <>
            </>
        );
    }
}

export default Logout;