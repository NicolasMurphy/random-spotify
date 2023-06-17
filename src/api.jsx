export const refreshAccessToken = async (setAccessToken) => {
    try {
      const clientId = '476c71bb69f4476a8e5b3f4d64c5bb98';
      const clientSecret = 'fb641cab33dd449cb46f71cdb1ab82d9';
      const credentials = `${clientId}:${clientSecret}`;
      const encodedCredentials = btoa(credentials);

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encodedCredentials}`,
        },
        body: 'grant_type=client_credentials',
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access_token);
      } else {
        console.error('Error refreshing access token:', response.status);
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };

  export const getRandomTrack = async (accessToken, setTrack, setIsLoading, resetAudio) => {
    try {
      setIsLoading(true);

      const searchTerm = await fetch('https://random-word-api.vercel.app/api?words=1')
        .then((response) => response.json())
        .then((data) => data[0]);

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const randomTrack = data.tracks.items[0];

        setTrack(randomTrack);
        resetAudio();
      } else {
        console.error('Error retrieving random track:', response.status);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error retrieving random track:', error);
      setIsLoading(false);
    }
  };
