from dotenv import load_dotenv

load_dotenv()

from datetime import datetime
import json
import os.path
from pydub import AudioSegment
from pydub.playback import play
import alsaaudio
import lights
import music

weekday_to_string = ["MON", "YUE", "WED", "THU", "FRI", "SAT", "SUN"]


def time_fmt(time: [int, int]) -> float:
    return time[0] + time[1] / 60


def check_time():
    settings = json.load(open("data/settings.json"))
    bedtime = time_fmt(settings["bedtime"])
    wakeup = time_fmt(settings["wakeup"])
    now = time_fmt([datetime.now().hour, datetime.now().minute])
    wakeup_day = weekday_to_string[datetime.now().weekday()]

    if bedtime > wakeup:
        wakeup += 24
        wkday = datetime.now().weekday()
        wakeup_day = weekday_to_string[wkday + 1 if wkday < 6 else 0]
        if now >= 0:
            now += 24

    if wakeup_day not in settings["days"]:
        return

    if bedtime == now:
        lights.bedtime()
    elif bedtime < now < wakeup:
        lights.meantime(now, bedtime, wakeup)
    elif now == wakeup:
        its_wakeup(settings)


def its_wakeup(settings: map):
    song = music.get_song(settings["musicURI"], settings["spotify"])
    song_audio = music.download_song(song["download"], settings["playTime"])

    alsaaudio.Mixer("PCM").setvolume(settings["volume"])

    lights.fade_in(0.5, song["color"])
    play(song_audio)
    lights.fade_out(0.5)


if __name__ == "__main__":
    check_time()
