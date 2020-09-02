import { NextApiRequest, NextApiResponse } from "next";
import newSpotifyClient from "utils/spotify";
// @ts-ignore
import { getColorFromURL } from "color-thief-node";

const getColor = async (
  album: SpotifyApi.AlbumObjectSimplified
): Promise<[number, number, number]> =>
  album.images.length === 0
    ? [255, 0, 0]
    : await getColorFromURL(album.images[0].url);

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

    spotify.setAccessToken(
      (await spotify.refreshAccessToken()).body.access_token
    );

    if (type === "playlist") {
      const playlist = await spotify.getPlaylist(uri);
      if (playlist.statusCode !== 200) throw null;

      for (let i = 0; i < 5; i++) {
        const { body: tracks } = await spotify.getPlaylistTracks(uri, {
          limit: 1,
          offset: Math.round(Math.random() * (playlist.body.tracks.total - 1)),
        });

        if (
          tracks.items.length === 1 &&
          !tracks.items[0].is_local &&
          tracks.items[0].track.preview_url
        ) {
          res.send({
            uri: tracks.items[0].track.uri,
            download: tracks.items[0].track.preview_url,
            color: await getColor(tracks.items[0].track.album),
          });
          return;
        }
      }
    } else if (type === "album") {
      const album = await spotify.getAlbum(uri);
      if (album.statusCode !== 200) throw null;

      for (let i = 0; i < 5; i++) {
        const { body: tracks } = await spotify.getAlbumTracks(uri, {
          limit: 1,
          offset: Math.round(Math.random() * (album.body.tracks.total - 1)),
        });

        if (tracks.items.length === 1 && tracks.items[0].preview_url) {
          res.send({
            uri: tracks.items[0].uri,
            download: tracks.items[0].preview_url,
            color: await getColor(album.body),
          });
          return;
        }
      }
    } else if (type === "track") {
      const track = await spotify.getTrack(uri);
      if (track.statusCode !== 200) throw null;

      if (!track.body.is_local && track.body.preview_url) {
        res.send({
          uri: track.body.uri,
          download: track.body.preview_url,
          color: await getColor(track.body.album),
        });
        return;
      }
    }

    throw null;
  } catch (error) {
    res.status(400).end();
  }
};
