import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';



var bread1 = {
    "id": 1,
    "sandwichId": 1,
    "status": "ordered"
}

var bread2 = {
    "id": 2,
    "sandwichId": 2,
    "status": "ordered"
}

var bread3 = {
    "id": 3,
    "sandwichId": 3,
    "status": "ordered"
}


function sendOrder(str) {
    console.log(str);
    fetch('http://localhost:3001', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(str)
    })
}



function MakeOrder() {
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start"
                secondaryAction={
                    <button
                        onClick={() => sendOrder(bread1)}>
                        Tilaa</button>
                }>
                <ListItemAvatar>
                    <Avatar alt="Italian BMT" src="https://www.subway.fi/img/products/fi_8.jpg" sx={{ width: 170, height: 120 }} />
                </ListItemAvatar>
                <ListItemText
                    primary="Italian B.M.T"
                    secondary={'Ihana, täyteläinen ja runsas Italian B.M.T.® on nautinto jo ajatuksena. Salamia, pepperonia, kinkkua sekä valitsemasi kasvikset ja lisukkeet. Takuuvarma nälän sammuttaja!'}
                />
            </ListItem>


            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start"
                secondaryAction={
                    <button
                        onClick={() => sendOrder(bread2)}>
                        Tilaa</button>
                }>
                <ListItemAvatar>
                    <Avatar alt="Kinkku" src="https://www.subway.fi/img/products/fi_4.jpg" sx={{ width: 170, height: 120 }} />
                </ListItemAvatar>
                <ListItemText
                    primary="Kinkku"
                    secondary={'Yksinkertainen on kaunista – ja herkullista. Runsaasti kinkkua yhdistettynä valitsemiisi kasviksiin ja lisukkeisiin. '}
                />
            </ListItem>


            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start"
                secondaryAction={
                    <button
                        onClick={() => sendOrder(bread3)}>
                        Tilaa</button>
                }>
                <ListItemAvatar>
                    <Avatar alt="Kananrinta" src="https://www.subway.fi/img/products/fi_2.jpg" sx={{ width: 170, height: 120 }} />
                </ListItemAvatar>
                <ListItemText
                    primary="Kananrinta"
                    secondary={'Herkullinen leipä, mehukas kananrintafilesuikale sekä valitsemasi kasviksesi ja lisukkeet. Siinä on ainekset mestariteokseen!'}
                />
            </ListItem>
        </List>
    );
}

export default MakeOrder;