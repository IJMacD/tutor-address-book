import React from 'react';
import './App.css';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';

const TOKEN_KEY = "tab-token";
const TUTOR_URL = "https://www.i-learner.edu.hk/api/v1/tutors";

function App() {
  const [ token, setToken ] = React.useState(localStorage.getItem(TOKEN_KEY));
  const [ tutors, setTutors ] = React.useState(null);

  React.useEffect(() => {
    if (token) {
      const headers = new Headers();
      headers.append("Authorization", "Bearer " + token);

      fetch(TUTOR_URL, {
        headers
      })
      .then(r => r.json())
      .then(tutors => setTutors(tutors));
    }
  }, [token]);

  return (
    <div className="App">
      {
        token ? <BookScreen tutors={tutors} /> : <LoginScreen onLogin={() => void 0} />
      }
    </div>
  );
}

export default App;