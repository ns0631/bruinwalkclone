import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import React, { useEffect, useState } from 'react';

async function initialSearch(id) {
    return (async () => {
      const rawResponse = await fetch("http://localhost:8000/api/overviewinfo", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({prof:1, id:id})
      });
      const content = await rawResponse.text();
      const z = JSON.parse(content);
      return z.name;
    })();
  }

function ProfOverview(props){
    const [profname, setProfName] = useState("");

    useEffect( () => {initialSearch(props.id).then( (value) => {
        setProfName(value);
    } )}, [] );

    return (
        <p>
            {profname}
        </p>
    );
}

export default ProfOverview;