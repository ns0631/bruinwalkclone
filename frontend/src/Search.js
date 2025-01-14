import React, { useEffect, useState } from 'react';

function modify(text, substring){
    let index = text.search(substring);
    if(text === substring){
      return <p><b>{text}</b></p>;
    } else if(index === 0){
      return <p><b>{substring}</b>{text.substring(substring.length, text.length)}</p>;
    } else if(index + substring.length === text.length){
      return <p>{text.substring(0, index)}<b>{substring}</b></p>;
    } else{
      let a = text.substring(0, index);
      let b = text.substr(index, substring.length);
      let c = text.substring(index + substring.length, text.length);
      return <p>{a}<b>{b}</b>{c}</p>;
    }
  }
  
  async function queryBackend(input) {
    return (async () => {
      const rawResponse = await fetch("http://localhost:8000/api/search", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: input})
      });
      const content = await rawResponse.text();
      const z = JSON.parse(content);
      let finished_data = z.map((a) => {return modify(a.name, input.toUpperCase())});
      if(finished_data.length > 10){
        return finished_data.slice(0, 10);
      }
      return finished_data;
    })();
  }
  
  function HomePageSearchBar() {
    const [name, setName] = useState("");
    const [newTags, setNewTags] = useState([]);
  
    useEffect(() => {
      if(name.length === 0){
        setNewTags([]);
      } else{
        queryBackend(name).then(
          function(value) {setNewTags(value);}
        );
      }
    }, [name]);
  
    return (
      <>
        <form action="/search" method="GET" name="q" id="searchform">
          <div className="mb-3 mt-3">
            <input type="text" className="form-control" id="query" placeholder="Search for a professor or class" name="q" value={name} onChange={(e) => setName(e.target.value)} required/>
          </div>
        </form>
        <div id="dropdownitems">
          {newTags}
        </div>
      </>
    );
  }

export default HomePageSearchBar;