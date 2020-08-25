from dotenv import load_dotenv

load_dotenv()

from pydub import AudioSegment
from pydub.playback import play
import lights
import music


def init():
    song_id = music.get_song_id()
    song_meta = music.get_meta(song_id)
    song_audio = music.download_song(song_id)

    print("Playing {}".format(song_meta["name"]))

    lights.show_music(0.5, song_meta["color"])
    play(song_audio)
    lights.hide_music(0.5)


if __name__ == "__main__":
    while True:
        init()
