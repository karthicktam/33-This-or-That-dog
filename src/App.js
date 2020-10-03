import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import './styles.css';

const config = {
  apiKey: 'AIzaSyAoflyeedZ5i4_TwTpCX0cvaH_GQ0BTRbY',
  authDomain: 'dogs-choose.firebaseapp.com',
  databaseURL: 'https://dogs-choose.firebaseio.com',
  projectId: 'dogs-choose',
  storageBucket: 'dogs-choose.appspot.com',
  messagingSenderId: '181210087800',
  appId: '1:181210087800:web:c1897221a301aeafb8488d',
  measurementId: 'G-QWC6CG3FN7'
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();

export default function App() {
  const [dogsDetail, setDogs] = useState({
    dogs: [],
    database: null,
    idx1: null,
    idx2: null
  });

  const getRandomDogs = () => {
    const { dogs } = dogsDetail;

    if (!dogs) {
      return;
    }

    const idx1 = Math.floor(Math.random() * dogs.length);
    const idx2 = Math.floor(Math.random() * dogs.length);

    setDogs((state) => ({ ...state, idx1: idx1, idx2: idx2 }));
  };

  useEffect(() => {
    const database = db.ref('/dogs');

    setDogs((state) => ({
      ...state,
      database: database
    }));
  }, []);

  const getDogs = () => {
    const { database } = dogsDetail;

    if (database) {
      database.on('value', (snapshot) => {
        const dogs = [];
        const dogsObj = snapshot.val();
        Object.keys(dogsObj).forEach((key) => {
          dogs.push(dogsObj[key]);
        });

        setDogs((state) => ({
          ...state,
          dogs: dogs
        }));
      });
    }
  };

  useEffect(() => {
    getDogs();
    let timeout = setTimeout(getRandomDogs, 2000);
    return () => clearTimeout(timeout);
  }, [dogsDetail.database]);

  const favoriteDog = (id) => {
    const { dogs, database } = dogsDetail;
    const dog = dogs.find((d) => d.id === id);

    // increase the likes
    database.child(id).update({ likes: dog.likes + 1 });
    getRandomDogs();
    getDogs();
  };

  const getMedal = (idx) => {
    switch (idx) {
      case 0:
        return (
          <p className="place place-1">
            <FontAwesomeIcon icon={faMedal} />
          </p>
        );

      case 1:
        return (
          <p className="place place-2">
            <FontAwesomeIcon icon={faMedal} />
          </p>
        );

      case 2:
        return (
          <p className="place place-3">
            <FontAwesomeIcon icon={faMedal} />
          </p>
        );

      default:
        return <p className="place">{idx + 1}</p>;
    }
  };

  const { dogs, idx1, idx2 } = dogsDetail;
  const dog1 = dogs[idx1];
  const dog2 = dogs[idx2];

  if (dogs.length === 0 || !idx1 || !idx2) return <h1>Loading data...</h1>;

  return (
    <div className="main">
      <h1 className="text-center">Which one is your favorite dog?</h1>
      <div className="container text-center">
        <div className="img-container">
          <img src={dog1.image} alt={dog1.name} />
          <h3 className="name">{dog1.name}</h3>
          <button
            className="choose-btn"
            onClick={favoriteDog.bind(this, dog1.id)}
          >
            This
          </button>
        </div>
        <h3 className="or">OR</h3>
        <div className="img-container">
          <img src={dog2.image} alt={dog2.name} />
          <h3 className="name">{dog2.name}</h3>
          <button
            className="choose-btn"
            onClick={favoriteDog.bind(this, dog2.id)}
          >
            That
          </button>
        </div>
      </div>
      <h3>Leaderboard - Top 10</h3>
      <table className="leaderboard">
        <tbody>
          {dogs
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 10)
            .map((dog, idx) => (
              <tr key={dog.id}>
                <td>{getMedal(idx)}</td>
                <td>
                  <img src={dog.image} alt={dog.name} />
                </td>
                <td className="name">{dog.name}</td>
                <td>{dog.likes}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
