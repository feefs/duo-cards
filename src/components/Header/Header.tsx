import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { auth } from '../../ts/firebase';
import './Header.scss';
import github from './github.svg';

function Header(): JSX.Element {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !navigate) {
      return;
    }
    if (!user) {
      navigate('/');
    }
  }, [loading, navigate, user]);

  return (
    <header className="Header">
      <div className="grid-container">
        <div className="logo">
          <span className="text" onClick={() => navigate('/')}>
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
              <button onClick={async () => await auth.signOut()}>Sign Out</button>
            </div>
          ) : (
            <button
              onClick={async () => {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
