import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../../ts/firebase';
import './Header.scss';

async function googleLogin() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

async function googleSignOut() {
  await auth.signOut();
}

export default function Header(): JSX.Element {
  const [user, ,] = useAuthState(auth);
  return (
    <header className="Header">
      <button onClick={googleLogin}>Sign in!</button>
      <button onClick={googleSignOut}>Sign out!</button>
      {user ? user.email : 'Not signed in!'}
    </header>
  );
}
