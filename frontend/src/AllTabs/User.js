import React, { useState } from 'react';
import SandwichForm from './AddingBread';

function User() {
  const [logOrCreate, setLogOrCreate] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const createUser = async () => {
    if (!username || !password || !email) {
      setErrorMessage('Please fill in all fields');
      return;
    }

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

    if (response.ok){
      console.log("account created");
    }
  }

  const loginUser = async () => {
    if (!username || !password) {
      setErrorMessage('Please enter a username and password');
      return;
    }
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
    if (response.ok){
      setLogOrCreate('LoggedIn')
    }
    const data = await response.json();
    console.log(data);
  }

  const handleLogout = () => {
    setLogOrCreate('');
    setErrorMessage('');
  }

  return (
    <div>
      <div>User</div>
      {errorMessage && (
      <div style={{ color: 'red' }}>{errorMessage}</div>)}
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
          <button onClick={() => {setLogOrCreate(''); setErrorMessage('');}}>Back</button>
        </form>
      )}

      {logOrCreate === 'Create' && (
        <form>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <button type="button" onClick={() => {createUser();
          setLogOrCreate('')}}>Create Account</button>
          <button onClick={() => {setLogOrCreate(''); setErrorMessage('');}}>Back</button>
        </form>
      )}

      {logOrCreate === 'LoggedIn' && (
        <div>
        <button onClick={handleLogout}>Logout</button>
        {isAdmin && (
          <SandwichForm setErrorMessage={setErrorMessage}></SandwichForm>
        )}
      </div>
    )}
    </div>
  )
}

export default User;