import { useState, useEffect } from 'react'
import './App.scss'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'

if (firebase.apps.length) {
  firebase.app()
} else {
  firebase.initializeApp({
    apiKey: "AIzaSyA7RC7k_Qb3Bs2wvRTDQCf0ARN0qapPork",
    authDomain: "duo-cards.firebaseapp.com",
    projectId: "duo-cards",
    storageBucket: "duo-cards.appspot.com",
    messagingSenderId: "1065170188826",
    appId: "1:1065170188826:web:fff3089d9deb25f9556fa3",
    measurementId: "G-88GXM9KV83"
  })
}

const auth = firebase.auth()
const db = firebase.firestore()

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header className="header">
        <div className="title">Duo-cards</div>
        <div></div>
        <div className="userStatus">
          {user ? false : <div>Not signed in!</div>}
          {user ? "Logged in as " + auth.currentUser?.displayName : <SignIn />}
          <div><SignOut /></div>
        </div>
      </header>

      <section>
        {user ? <Decks/> : <p>No decks to show</p>}
      </section>
    </div>
  )
}

function Decks() {
  const [, setDecksRef] = useState({})

  const fetchDoc = async () => {
    const userSnapshot = db.collection('users').doc(`${auth.currentUser?.uid}`)
    const userData = await userSnapshot.get()
    if (!userData.exists) {
      userSnapshot.set({
        decks: [],
        logins: 0
      })
    } else {
      userSnapshot.update({
        logins: userData.get('logins') + 1
      })
    }
    setDecksRef(userSnapshot)
  }

  useEffect(() => {
    fetchDoc()
  }, [])

  return <p>Placeholder deck text</p>
}

function SignIn() {
  const googleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
    console.log('signing in')
  }
  return <button onClick={googleLogin}>Sign in with Google</button>
}

function SignOut() {
  return auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
}

export default App
