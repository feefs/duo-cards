import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../App';

import firebase from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'

// Types
import { HistType } from '../ts/interfaces';

function Header() {
  const [user] = useAuthState(auth)
  const history: HistType = useHistory()

  useEffect(() => {
    async function updateDB() {
      if (!user) { return }

      const userSnapshot = db.collection('users').doc(`${user.uid}`)
      const userData = await userSnapshot.get()

      if (!userData.exists) {
        userSnapshot.set({ visits: 0 })
      } else {
        const prevVisits = await userData.get('visits')
        userSnapshot.update({ visits: (prevVisits ? prevVisits : -1) + 1 })
      }
    }

    updateDB()
  }, [user])

  const goHome = () => {
    history.push('/duo-cards')
  }

	return (
	  <header className="header">
      <div
        onClick={() => goHome()}
        className="title"
      >
        Duo-cards (ja)
      </div>
      <div></div>
      <div className="userStatus">
        {user ? [ <div key={0}>{auth.currentUser?.email}</div>, <div key={1}><SignOut history={history} /></div>]
              : <div><SignIn history={history} /></div>}
      </div>
	  </header>
	)
}

function SignIn(props: {history: HistType}) {
	const googleLogin = async () => {
	  const provider = new firebase.auth.GoogleAuthProvider()
    await auth.signInWithPopup(provider)
    props.history.push('/duo-cards')
  }

	return <button className="googleButton" onClick={googleLogin}>Sign In</button>
}
  
function SignOut(props: {history: HistType}) {
  const signOutAndHome = async () => {
    await auth.signOut()
    props.history.push('/duo-cards')
  }

	return <button className="googleButton" onClick={signOutAndHome}>Sign Out</button>
}

export default Header
