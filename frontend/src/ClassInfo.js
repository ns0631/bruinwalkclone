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
        body: JSON.stringify({prof:0, id:id})
      });
      const content = await rawResponse.text();
      const z = JSON.parse(content);

      if(z.avgRating === "N/A"){
        z.backgroundColor = "gray";
      } else if(z.avgRating > 4.5){
        z.backgroundColor = "#066306";
      } else if(z.avgRating > 3.5){
        z.backgroundColor = "#0cb31a";
      } else if(z.avgRating > 2.5){
        z.backgroundColor = "#e8f007";
      } else if(z.avgRating > 1.5){
        z.backgroundColor = "orange";
      } else{
        z.backgroundColor = "red";
      }
      
      return z;
    })();
  }

function ClassOverview(props){
    const [classname, setClassName] = useState("");
    const [classcode, setClassCode] = useState("");
    const [avgRating, setAvgRating] = useState(0);
    const [profs, setProfs] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState(["gray"]);

    useEffect( () => { initialSearch(props.id).then( (output) => {
        setClassCode(output.name);
        setClassName(output.fullName);
        setAvgRating(output.avgRating);
        setProfs(output.profs.map((a) => {
            let textColor;
            if(a[1] === "N/A"){
                textColor = "black";
              } else if(a[1] > 4.5){
                textColor = "#066306";
              } else if(a[1] > 3.5){
                textColor = "#0cb31a";
              } else if(a[1] > 2.5){
                textColor = "#e8f007";
              } else if(a[1] > 1.5){
                textColor = "orange";
              } else{
                textColor = "red";
              }
            return <div className="profprofile">{a[0]}<span style={{color:textColor}} className="avgratingprofprofile">{a[1]}</span></div>;
        } ));
        setBackgroundColor(output.backgroundColor);
    } ) } , [] );

    return (
        <p>
            <div className="avgclassrating" style={{backgroundColor: backgroundColor}}>
                {avgRating}
            </div>
            <span className="overallratinglabel">Overall<br/>Rating</span>
            <a href={"/classes?q=" + classcode}>
                <div className="classcode">
                    {classcode}
                </div>
                <div className="formalclassname">
                    {classname}
                </div>
            </a>
            <div className="proflistingsforcourse">
                {profs}
            </div>
        </p>
    );
}

export default ClassOverview;