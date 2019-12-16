import React from 'react';
import './App.css';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import AuthFetch from './AuthFetch';

const TOKEN_KEY = "tab-token";
const TOKEN_URL = "https://www.i-learner.edu.hk/api/v1/auth/generate";
const REFRESH_URL = "https://www.i-learner.edu.hk/api/v1/auth/refresh";
const INVALIDATE_URL = "https://www.i-learner.edu.hk/api/v1/auth/invalidate";
const TUTOR_URL = "https://www.i-learner.edu.hk/api/v1/tutors";

const af = new AuthFetch({
  tokenKey: TOKEN_KEY,
  tokenURL: TOKEN_URL,
  refreshURL: REFRESH_URL,
  invalidateURL: INVALIDATE_URL,
});

function useToken (af) {
  const [ loggedIn, setLoggedIn ] = React.useState(af.hasToken());

  React.useEffect(() => {
    const cb = token => setLoggedIn(!!token);

    af.subscribe(cb);

    return () => af.unsubscribe(cb);
  }, [af]);

  return loggedIn;
}

function App() {
  const hasToken = useToken(af);
  const [ tutors, setTutors ] = React.useState(null);
  const [ error, setError ] = React.useState(null);

  const login = (user, pass) => {
    af.getToken(user, pass).catch(e => setError(e));
  };

  const fetchTutors = () => af.fetch(TUTOR_URL).then(setTutors, setError);

  React.useEffect(() => {
    if (hasToken) {
      fetchTutors();
    }
  }, [hasToken]);

  return (
    <div className="App">
      {
        hasToken ?
          <BookScreen tutors={tutors} /> : <LoginScreen error={error} onLogin={login} />
      }
    </div>
  );
}

export default App;
