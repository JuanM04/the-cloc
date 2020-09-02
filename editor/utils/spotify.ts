import SpotifyWebApi from "spotify-web-api-node";

const newSpotifyClient = (extras?: {
  accessToken?: string;
  refreshToken?: string;
}) =>
  new SpotifyWebApi({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_URL}/spotify-callback`,
    ...(extras || {}),
  });

export default newSpotifyClient;
