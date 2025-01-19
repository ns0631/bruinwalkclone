import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

var months = ["January", "February", "March", "April",
              "May", "June", "July", "August", "September",
              "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

async function deleteReview(id) {
    return (async () => {
          const rawResponse = await fetch("http://localhost:8000/api/deletereview", {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id})
    });
        
    const content = await rawResponse.text();
    if(content === "success"){
        document.getElementsByClassName("deletedmessage")[0].classList.remove("alert-danger");
        document.getElementsByClassName("deletedmessage")[0].classList.add("alert-success");
        document.getElementsByClassName("deletedmessage")[0].style.visibility = "visible";
        document.getElementById("actualdeletemessage").innerHTML = "<strong>Success! </strong>Your review has been deleted. Refresh to see changes.";
    } else if(content === "failure"){
        document.getElementsByClassName("deletedmessage")[0].classList.remove("alert-success");
        document.getElementsByClassName("deletedmessage")[0].classList.add("alert-danger");
        document.getElementsByClassName("deletedmessage")[0].style.visibility = "visible";
        document.getElementById("actualdeletemessage").innerHTML = "<strong>Failure. </strong>Your aren't logged in.";
    } else{
        document.getElementsByClassName("deletedmessage")[0].classList.remove("alert-success");
        document.getElementsByClassName("deletedmessage")[0].classList.add("alert-danger");
        document.getElementsByClassName("deletedmessage")[0].style.visibility = "visible";
        document.getElementById("actualdeletemessage").innerHTML = "Something went wrong.";
    }
    
    })();
}

function DeleteButton(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button className="deletebutton" onClick={handleShow}><i class="fa fa-trash-o"></i></Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete review?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Once you delete this review, you can't get it back.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={ () => {deleteReview(props.id); handleClose()} }>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  

function EditableReview(data){
    let date = new Date(data.recordDate);
    let text = data.reviewBody;
    let class_Name = data.class;
    let professor = data.prof;
    let quarter = data.quarterTaken;
    let yearTaken = data.yearTaken;
    
    return (
        <>
            <div className="userreview editable">
                <p className="publishdate">{days[date.getDay()]}, {months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</p>
                <p className="courseinfo">{class_Name} — {professor}</p>
                <p className="timetaken">{quarter} {yearTaken}</p>
                <div className="reviewbody"><p>{text}</p></div>

                <DeleteButton id={data.id}/>
            </div>
        </>
    );
}

function ReadableReview(data){
    return (
        <>
        </>
    );
}

export { EditableReview, ReadableReview };