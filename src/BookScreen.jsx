import React from 'react';
import './BookScreen.css';

export default function BookScreen ({ tutors }) {
    if (!tutors) return null;

    return (
        <div className="BookScreen">
            <ul className="BookScreen-List">
                {
                    tutors.map(t => (
                        <li key={t.id} className="BookScreen-Card">
                            <img
                                className="BookScreen-photo"
                                src={`http://www.i-learner.edu.hk/img/tutors/${t.id}.jpg`}
                                style={{ backgroundColor: t.colour, borderColor: t.colour }} 
                                onLoad={e => e.target.style.minHeight = "10px"}
                                onError={e => e.target.src = ""}
                            />
                            <p className="BookScreen-name">{t.name}</p>
                            <p className="BookScreen-nameZH">{t.nameZH}</p>
                            <a className="BookScreen-email" href={`mailto:${t.email}`}>{t.email}</a>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}
