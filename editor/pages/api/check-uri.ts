import { NextApiRequest, NextApiResponse } from "next";
import newSpotifyClient from "utils/spotify";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (typeof req.body !== "object" || !req.body.auth || !req.body.uri) {
    res.status(400).end();
    return;
  }

  const spotify = newSpotifyClient(req.body.auth);

  try {
    // spotify:playlist:63TxrfKHsWjf8mPDNl5UM7
    // spotify:album:3OyBf97NOuJjhEpQHY920H
    // spotify:track:6hLY3Tz1Xt5kBuKNDTs4ib
    const [, type, uri] = req.body.uri.split(":");

    let statusCode = 0;

    spotify.setAccessToken(
      (await spotify.refreshAccessToken()).body.access_token
    );

    if (type === "playlist") {
      const res = await spotify.getPlaylist(uri);
      statusCode = res.statusCode;
    } else if (type === "album") {
      const res = await spotify.getAlbum(uri);
      statusCode = res.statusCode;
    } else if (type === "track") {
      const res = await spotify.getTrack(uri);
      statusCode = res.statusCode;
    } else {
      res.status(400).end();
    }

    if (statusCode === 200) res.send({ valid: true });
    else res.send({ valid: false });
  } catch (error) {
    res.status(500).send(error);
  }
};
