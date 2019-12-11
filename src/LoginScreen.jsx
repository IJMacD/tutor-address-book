import React from 'react';
import './LoginScreen.css';

export default function LoginScreen ({ onLogin }) {
    const [ user, setUser ] = React.useState("");
    const [ pass, setPass ] = React.useState("");

    return (
        <div className="LoginScreen">
            <form onSubmit={e => { e.preventDefault(); onLogin(user, pass) }}>
                <input type="text" placeholder="Username" value={user} onChange={e => setUser(e.target.value)} />
                <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
                <button>Login</button>
            </form>
        </div>
    );
}
