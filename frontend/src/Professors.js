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
      if(z.avgRating === "N/A"){
        z.backgroundColor = "gray";
      } else if(z.avgRating > 4.5){
        z.backgroundColor = "#066306";
      } else if(z.avgRating > 3.5){
        z.backgroundColor = "#0cb31a";
      } else if(z.avgRating > 2.5){
        z.backgroundColor = "#f5e90a";
      } else if(z.avgRating > 1.5){
        z.backgroundColor = "orange";
      } else{
        z.backgroundColor = "red";
      }
      return z;
    })();
}

function ProfOverview(props){
    useEffect( () => {initialSearch(props.id).then( (value) => {
        setProfName(value);
    } )}, [] );

    const [profname, setProfName] = useState("");
    const [avgRating, setAvgRating] = useState(0);
    const [profClasses, setprofClasses] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState(["gray"]);

    useEffect( () => { initialSearch(props.id).then( (output) => {
        setProfName(output.name);
        setAvgRating(output.avgRating);
        setprofClasses(output.profClasses.map((a) => {
            let textColor;
            if(a[1] === "N/A"){
                textColor = "black";
              } else if(a[1] > 4.5){
                textColor = "#066306";
              } else if(a[1] > 3.5){
                textColor = "#0cb31a";
              } else if(a[1] > 2.5){
                textColor = "#f5e90a";
              } else if(a[1] > 1.5){
                textColor = "orange";
              } else{
                textColor = "red";
              }
            return <div className="profprofile"><a href={"/classes?q=" + a[0] + "&prof=" + output.name} className="classcode">{a[0]}</a><span style={{color:textColor}} className="avgratingprofprofile">{a[1]}</span><a href={"/classes?q=" + a[0] + "&prof=" + output.name} className="formalclassname">{a[2]}</a></div>;
        } ));
        setBackgroundColor(output.backgroundColor);
        console.log(profClasses);
        console.log(output);
    } ) } , [] );

    return (
        <p>
            <div className="avgclassrating" style={{backgroundColor: backgroundColor}}>
                {avgRating}
            </div>
            <span className="overallratinglabel">Overall<br/>Rating</span>
            <span>
                {typeof profname === (typeof "string") ? profname : ""}
            </span>
            <div className="proflistingsforcourse">
                {profClasses}
            </div>
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
            setBackgroundColor("#f5e90a");
          } else if(avgRating > 1.5){
            setBackgroundColor("orange");
          } else{
            setBackgroundColor("red");
          }
    }, avgRating );

    return (
        <>
            <div class="col-lg-4 professoroverviewforclass">
                <p style={{float:"left"}}><a href={`/classes?q=${props.data[6]}&prof=${props.data[0]}`}>{props.data[0]}</a></p>
                <div className="avgclassrating" style={{backgroundColor: backgroundColor}}>
                    {avgRating}
                </div>
                <span className="overallratinglabel">Overall<br/>Rating</span>

                <div className="individualratings">
                    <div class="row">
                        <div class="col-md-6">
                            <span className="ratingcomponent">Ease</span>
                            <span className="ratingvalue">{props.data[2]}/5</span>
                            <span className="ratingvisual"><progress value={props.data[2]} max="5"></progress></span>
                        </div>
                        <div class="col-md-6">
                            <span className="ratingcomponent">Helpfulness</span>
                            <span className="ratingvalue">{props.data[3]}/5</span>
                            <span className="ratingvisual"><progress value={props.data[3]} max="5"></progress></span>
                        </div>
                    </div>
                    <div class="row">
                    <div class="col-md-6">
                            <span className="ratingcomponent">Clarity</span>
                            <span className="ratingvalue">{props.data[4]}/5</span>
                            <span className="ratingvisual"><progress value={props.data[4]} max="5"></progress></span>
                        </div>
                        <div class="col-md-6">
                            <span className="ratingcomponent">Workload</span>
                            <span className="ratingvalue">{props.data[5]}/5</span>
                            <span className="ratingvisual"><progress value={props.data[5]} max="5"></progress></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">

            </div>
        </>
    );
}

function ProfForClassSummary(props){
    const [backgroundColor, setBackgroundColor] = useState("gray");
    let avgRating = props.data.overall;

    useEffect( () => {
        if(avgRating === "N/A"){
            setBackgroundColor("gray");
          } else if(avgRating > 4.5){
            setBackgroundColor("#066306");
          } else if(avgRating > 3.5){
            setBackgroundColor("#0cb31a");
          } else if(avgRating > 2.5){
            setBackgroundColor("#f5e90a");
          } else if(avgRating > 1.5){
            setBackgroundColor("orange");
          } else{
            setBackgroundColor("red");
          }
    }, avgRating );

    return (
        <>
            <div class="profsummaryforclass">
                <div className="overall" style={{backgroundColor: backgroundColor}}>
                    <div className="additionalreviewinfo">
                        <span className="mostimportantrating">{props.data.overall}</span>
                        <span className="overallratinglabel">Overall Rating</span>
                        <br/>
                        <span className="numuserratings">Based on {props.data.num_reviews} user{props.data.num_reviews == 1 ? "" : "s" }</span>
                    </div>
                </div>

                <div className="individualratings">
                    <div class="rating">
                        <span className="ratingcomponent">Ease</span>
                        <span className="ratingvalue">{props.data.ease}/5</span>
                        <span className="ratingvisual"><progress value={props.data.ease} max="5"></progress></span>
                    </div>
                    <div class="rating">
                        <span className="ratingcomponent">Helpfulness</span>
                        <span className="ratingvalue">{props.data.helpfulness}/5</span>
                        <span className="ratingvisual"><progress value={props.data.helpfulness} max="5"></progress></span>
                    </div>
                    <div class="rating">
                        <span className="ratingcomponent">Clarity</span>
                        <span className="ratingvalue">{props.data.clarity}/5</span>
                        <span className="ratingvisual"><progress value={props.data.clarity} max="5"></progress></span>
                    </div>
                    <div class="rating">
                        <span className="ratingcomponent">Workload</span>
                        <span className="ratingvalue">{props.data.workload}/5</span>
                        <span className="ratingvisual"><progress value={props.data.workload} max="5"></progress></span>
                    </div>
                </div>
            </div>
        </>
    );
}

export {ProfForClassOverview, ProfOverview, ProfForClassSummary};