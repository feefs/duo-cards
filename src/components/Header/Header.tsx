import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { auth } from '../../ts/firebase';
import './Header.scss';
import github from './github.svg';

async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

async function googleSignOut() {
  await auth.signOut();
}

function SignIn(): JSX.Element {
  return <button onClick={googleSignIn}>Sign In</button>;
}

function SignOut(): JSX.Element {
  return <button onClick={googleSignOut}>Sign Out</button>;
}

function Header(): JSX.Element {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !navigate) {
      return;
    }
    if (!user) {
      navigate('/duo-cards');
    }
  }, [loading, navigate, user]);

  return (
    <header className="Header">
      <div className="grid-container">
        <div className="logo">
          <span className="text" onClick={() => navigate('/duo-cards')}>
            Duo-cards
          </span>
          <a href="https://github.com/feefs/duo-cards" rel="noreferrer" target="_blank">
            <img className="github" src={github} alt="Github" />
          </a>
        </div>
        <div />
        <div className="user-auth">
          {loading ? null : user ? (
            <div>
              {user.email}
              <SignOut />
            </div>
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
