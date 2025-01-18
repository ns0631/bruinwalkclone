import React, { useEffect, useState } from 'react';

function EditableReview(data){
    let dateTime = new Date(data.date);
    let text = data.text;
    let class_Name = data.class;
    let professor = data.prof;
    
    return (
        <div className="userreview editable">
            <p>{dateTime}</p>
            <p>{text}</p>;
            <p>{class_Name}</p>
            <p>{professor}</p>
        <div/>
    );
}

function ReadableReview(){

}

export { EditableReview ReadableReview };