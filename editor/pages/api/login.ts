import { NextApiRequest, NextApiResponse } from "next";
import newSpotifyClient from "utils/spotify";

function state() {
  const values =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let accum = "";
  for (let i = 0; i < 16; i++) {
    accum += values[Math.round(Math.random() * (values.length - 1))];
  }
  return accum;
}

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const spotify = newSpotifyClient();
  const scopes = ["playlist-read-collaborative", "playlist-read-private"];

  const authorizeURL = spotify.createAuthorizeURL(scopes, state());

  res.status(302);
  res.setHeader("Location", authorizeURL);
  res.end();
};
