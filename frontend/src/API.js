import React from 'react';


var bread = {
    "id": 0,
    "sandwichId": 0,
    "status": "ordered"
  }

function sendOrder(){
    fetch('localhost:3001', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(bread)
    })
}


function API(){
    return (
    <div>
        <div>testi</div>
        <button onClick={sendOrder}></button>
    </div>)
}

export default API;