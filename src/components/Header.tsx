import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth, db } from '../App';

import firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'

function Header() {
  const [user] = useAuthState(auth)

  useEffect(() => {
    async function updateDB() {
      if (!user) { return }
      const userSnapshot = db.collection('users').doc(`${user.uid}`)
      const userData = await userSnapshot.get()

      if (!userData.exists) {
        userSnapshot.set({ decks: [], visits: 0 })
      } else {
        userSnapshot.update({ visits: userData.get('visits') + 1 })
      }
    }
    updateDB()
  }, [user])

	return (
	  <header className="header">
		<Link to="/duo-cards" style={{textDecoration: 'none'}}>
		  <div className="title">Duo-cards (ja)</div>
		</Link>
		<div></div>
		<div className="userStatus">
		  {user ? [
        <div key={0}>{auth.currentUser?.email}</div>,
        <div key={1}><SignOut /></div>
      ] : <div><SignIn /></div>}
		</div>
	  </header>
	)
}

function SignIn() {
	const googleLogin = async () => {
	  const provider = new firebase.auth.GoogleAuthProvider()
	  auth.signInWithPopup(provider)
  }

	return <button className="googleButton" onClick={googleLogin}>Sign In</button>
}
  
function SignOut() {
  const history = useHistory()
  const signOutAndHome = async () => {
    await auth.signOut()
    history.push('/duo-cards')
  }

	return <button className="googleButton" onClick={signOutAndHome}>Sign Out</button>
}

export default Header
