import React, { useState } from 'react';

function User() {
  const [logOrCreate, setLogOrCreate] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const createUser = async () => {
    const response = await fetch('http://localhost:3001/user', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email
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

      {logOrCreate === '' && (
        <div>
          <button onClick={() => setLogOrCreate('Login')}>Login</button>
          <button onClick={() => setLogOrCreate('Create')}>Create Account</button>
        </div>
      )}

      {logOrCreate === 'Login' && (
        <form>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="button" onClick={loginUser}>Login</button>
          <button onClick={() => setLogOrCreate('')}>Back</button>
        </form>
      )}

      {logOrCreate === 'Create' && (
        <form>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <button type="button" onClick={createUser}>Create Account</button>
          <button onClick={() => setLogOrCreate('')}>Back</button>
        </form>
      )}
    </div>
  )
}

export default User;