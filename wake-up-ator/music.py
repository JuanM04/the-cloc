import requests
import math
from pydub import AudioSegment
from pydub.playback import play
from random import randint
from os import environ
from shutil import copyfile


def download_song(url: str, play_time: int) -> AudioSegment:
    play_time *= 1000
    fade_time = math.ceil(play_time / 8)

    try:
        if url == "null":
            raise ValueError()
        song_file = requests.get(url)
        open("data/song.mp3", "wb").write(song_file.content)
    except:
        copyfile("data/default.mp3", "data/song.mp3")

    song = AudioSegment.from_mp3("data/song.mp3")[:play_time]
    song = song.fade_in(fade_time).fade_out(fade_time)

    return song


def get_song(uri: str, auth: dict or None) -> map:
    try:
        if auth is None:
            raise Exception()

        return requests.post(
            "{}/api/get-song-data".format(environ["ENDPOINT"]),
            json={"uri": uri, "auth": auth},
        ).json()
    except:
        return {"uri": "null", "download": "null", "color": [255, 0, 0]}
