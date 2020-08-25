import spotipy
from spotipy.oauth2 import SpotifyOAuth
from colorthief import ColorThief
import requests
from pydub import AudioSegment
from pydub.playback import play
from random import randint

sp = spotipy.Spotify(
    auth_manager=SpotifyOAuth(
        scope="playlist-read-collaborative playlist-read-private",
        cache_path=".temp/spotipy.json",
    )
)

total_time = 10000
fade_time = 1000


def download_song(song_id: str) -> AudioSegment:
    result = sp.track(song_id)

    song_file = requests.get(result["preview_url"])
    open(".temp/song.mp3", "wb").write(song_file.content)

    song = AudioSegment.from_mp3(".temp/song.mp3")[:total_time]
    song -= 12  # -12dB
    song = song.fade_in(fade_time).fade_out(fade_time)

    return song


def get_meta(song_id: str) -> map:
    result = sp.track(song_id)

    img = requests.get(result["album"]["images"][0]["url"])
    open(".temp/cover.jpg", "wb").write(img.content)

    return {
        "name": result["name"],
        "color": ColorThief(".temp/cover.jpg").get_color(quality=1),
        "total_time": total_time,
        "fade_time": fade_time,
    }


def get_song_id() -> str:
    playlist = sp.playlist("spotify:playlist:63TxrfKHsWjf8mPDNl5UM7")
    tracks = sp.playlist_tracks(
        playlist["id"], limit=1, offset=randint(0, playlist["tracks"]["total"] - 1)
    )
    if len(tracks["items"]) == 0 or tracks["items"][0]["track"]["preview_url"] == None:
        return get_song_id()
    else:
        return tracks["items"][0]["track"]["id"]
