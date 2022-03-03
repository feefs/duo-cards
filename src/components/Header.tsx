import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../ts/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

async function googleLogin() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

async function googleSignOut() {
  await auth.signOut();
}

export function Header(): JSX.Element {
  const [user, ,] = useAuthState(auth);
  return (
    <>
      <button onClick={googleLogin}>Sign in!</button>
      <button onClick={googleSignOut}>Sign out!</button>
      {user ? user.email : 'Not signed in!'}
    </>
  );
}
