import { NextApiRequest, NextApiResponse } from "next";
import newSpotifyClient from "utils/spotify";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (typeof req.body !== "string" || req.body.trim().length === 0) {
    res.status(400).end();
    return;
  }

  const spotify = newSpotifyClient();

  try {
    const data = await spotify.authorizationCodeGrant(req.body);
    if (data.statusCode !== 200) throw data;

    spotify.setAccessToken(data.body.access_token);
    spotify.setRefreshToken(data.body.refresh_token);

    const { body: me } = await spotify.getMe();

    res.send({
      name: me.display_name || me.id,
      photo: me.images?.[0].url || null,
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
