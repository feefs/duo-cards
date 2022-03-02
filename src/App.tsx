import React from 'react';
import logo from './logo.svg';
import './css/App.css';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './ts/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

async function googleLogin() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

async function googleSignOut() {
  await auth.signOut();
}

function App() {
  const [user, ,] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={googleLogin}>Sign in!</button>
        <button onClick={googleSignOut}>Sign out!</button>
        {user ? user.email : 'Not signed in!'}
      </header>
    </div>
  );
}

export default App;
