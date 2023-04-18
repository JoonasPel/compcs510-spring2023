import React, { useState } from 'react';

function User() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const createUser = async () => {
    const response = await fetch('http://localhost:3001/user', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    const data = await response.json();
    console.log(data);
  }

  const loginUser = async () => {
    const response = await fetch('http://localhost:3001/user/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    const data = await response.json();
    console.log(data);
  }

  const logoutUser = async () => {
    const response = await fetch('http://localhost:3001/user/logout', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  return (
    <div>
      <div>User</div>
      <form>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="button" onClick={createUser}>Create User</button>
        <button type="button" onClick={loginUser}>Login</button>
        <button type="button" onClick={logoutUser}>Logout</button>
      </form>
    </div>
  )
}

export default User;