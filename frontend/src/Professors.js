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

function ProfForClassOverview(props){
    const [backgroundColor, setBackgroundColor] = useState("gray");
    const [avgRating, setAvgRating] = useState(props.data[1]);

    useEffect( () => {
        if(avgRating === "N/A"){
            setBackgroundColor("gray");
          } else if(avgRating > 4.5){
            setBackgroundColor("#066306");
          } else if(avgRating > 3.5){
            setBackgroundColor("#0cb31a");
          } else if(avgRating > 2.5){
            setBackgroundColor("#e8f007");
          } else if(avgRating > 1.5){
            setBackgroundColor("orange");
          } else{
            setBackgroundColor("red");
          }
    }, avgRating );

    return (
        <>
            <div class="col-lg-4 professoroverviewforclass">
                <p style={{float:"left"}}>{props.data[0]}</p>
                <div className="avgclassrating" style={{backgroundColor: backgroundColor}}>
                    {avgRating}
                </div>
                <span className="overallratinglabel">Overall<br/>Rating</span>
                
                <p>Ease {props.data[2]}</p>
                <p>Helpfulness {props.data[3]}</p>
                <p>Clarity {props.data[4]}</p>
                <p>Workload {props.data[5]}</p>
            </div>
            <div class="col-lg-4">

            </div>
        </>
    );
}

export {ProfForClassOverview, ProfOverview};