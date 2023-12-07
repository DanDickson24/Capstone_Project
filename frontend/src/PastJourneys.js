import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';

function PastJourneys() {
  const [journeys, setJourneys] = useState([]);
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchJourneys() {
      try {
        const response = await axios.get('http://localhost:3000/user/pastjourneys', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setJourneys(response.data);
      } catch (error) {
        console.error('Error fetching past journeys:', error);
      }
    }

    fetchJourneys();
  }, [user.token]);

  return (
    <div>
      {journeys.map(journey => (
        <div key={journey.transaction_id}>
          <p>Name: {user.user_type === 'driver' ? journey.customer_name : journey.driver_name}</p>
        </div>
      ))}
    </div>
  );
}

export default PastJourneys;
