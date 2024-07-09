'use client';

import axios from 'axios';
import crypto from 'crypto';
import { useState } from 'react';

export default function Home() {
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [gnapResponse, setGnapResponse] = useState<string | null>(null);

  const fetchSecretKey = async () => {
    try {
      const response = await axios.get('/api/gnap');
      setSecretKey(response.data.secretKey);
    } catch (error) {
      console.error('Error fetching secret key:', error);
    }
  };

  const testGnapEndpoint = async () => {
    if (!secretKey) {
      console.error('Secret key not available');
      return;
    }

    try {
      const accessToken = `Bearer ${crypto.randomBytes(32).toString('hex')}`;

      const response = await axios.post('/api/gnap', {
        grant_type: 'authorization_code',
        client_id: 'my-client-id',
        access_token: accessToken,
      });
      setGnapResponse(response.data.status);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setGnapResponse(error.response?.data.error);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div>
      <h1>GNAP Test Endpoint</h1>
      {secretKey ? (
        <p>Your secret key for signing requests is: <code>{secretKey}</code></p>
      ) : (
        <button onClick={fetchSecretKey}>Get Secret Key</button>
      )}
      <button onClick={testGnapEndpoint}>Test GNAP Endpoint</button>
      {gnapResponse && <p>Response: {gnapResponse}</p>}
    </div>
  );
}