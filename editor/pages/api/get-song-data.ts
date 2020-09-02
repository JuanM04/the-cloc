import { NextApiRequest, NextApiResponse } from "next";
import newSpotifyClient from "utils/spotify";

import util from "util";
import fs from "fs";
import stream from "stream";
// @ts-ignore
import ColorThief from "colorthief";

const getColor = async (
  album: SpotifyApi.AlbumObjectSimplified
): Promise<[number, number, number]> => {
  if (album.images.length === 0) return [255, 0, 0];

  const streamPipeline = util.promisify(stream.pipeline);

  const response = await fetch(album.images[0].url);
  if (!response.ok)
    throw new Error(`Error fetching album img: ${response.statusText}`);
  // @ts-ignore
  await streamPipeline(response.body, fs.createWriteStream("/tmp/album.jpg"));

  return await ColorThief.getColor("/tmp/album.jpg");
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (typeof req.body !== "object" || !req.body.auth || !req.body.uri) {
    res.status(400).send({ error: "Invalid params" });
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
      if (playlist.statusCode !== 200) throw "Playlist doesn't exist";

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
      if (album.statusCode !== 200) throw "Album doesn't exist";

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
      if (track.statusCode !== 200) throw "Song doesn't exist";

      if (!track.body.is_local && track.body.preview_url) {
        res.send({
          uri: track.body.uri,
          download: track.body.preview_url,
          color: await getColor(track.body.album),
        });
        return;
      }
    }

    throw "Invalid type. Must be a playlist, album or song";
  } catch (error) {
    res.status(400).send({
      error: typeof error === "string" ? error : error?.message || error,
    });
  }
};
