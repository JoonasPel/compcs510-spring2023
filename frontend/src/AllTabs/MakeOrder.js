import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

function MakeOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sandwiches, setSandwiches] = useState([]);

  const sendOrder = async (str) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const response = await fetch('http://localhost:3001/order', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(str),
        headers: { 'Content-Type': 'application/json' }
      });
      setLoading(false);
      if (response.ok) {
        setSuccess(true);
        console.log('Success! Response:', response);
      } else {
        setError('Failed to send order.');
        console.error('Error:', response);
      }
    } catch (error) {
      setLoading(false);
      setError('Failed to send order.');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchSandwiches = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3001/sandwich');
        setLoading(false);
        if (response.ok) {
          const data = await response.json();
          setSandwiches(data);
        } else {
          setError('Failed to fetch sandwiches.');
          console.error('Error:', response);
        }
      } catch (error) {
        setLoading(false);
        setError('Failed to fetch sandwiches.');
        console.error('Error:', error);
      }
    };
    fetchSandwiches();
  }, []);

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {sandwiches.map((sandwich) => (
        <React.Fragment key={sandwich.id}>
          <ListItem
            alignItems="flex-start"
            secondaryAction={
              <button onClick={() => sendOrder({ sandwichId: sandwich.id, status: 'ordered' })}>
                Tilaa
              </button>
            }
          >
            <ListItemText primary={sandwich.name} secondary={sandwich.description} />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}

export default MakeOrder;