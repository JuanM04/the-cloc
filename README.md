<p align="center">
  <h1>The Cloc</h1>
  <img src="https://img.shields.io/badge/day-3-black?style=for-the-badge" alt="Day 3" />
</p>

## Installation

```bash
$ sudo pip3 install adafruit-circuitpython-neopixel==6.0.0 \
                    colorthief==0.2.1 \
                    ffmpeg-python==0.2.0 \
                    pydub==0.24.1 \
                    python-dotenv==0.14.0 \
                    requests==2.24.0 \
                    rpi-ws281x==4.2.4 \
                    spotipy==2.13.0
$ sudo python3 -m pip install --force-reinstall adafruit-blinka==5.3.0
```

> **Why Sudo?**
> Because NeoPixels library needs root to be run, so all dependencies need to be installed using `sudo pip3 install` instead of `pip3 install`.

### Spotipy

First, you'll need to create an app in the [_Spotify for Developers_ Dashboard](https://developer.spotify.com/dashboard). Then, put the client ID and secret in a `.env`, following [this pattern](.env.example).

If this is the first time you run the program, you should run `sudo pip3 music.py` **in your PC**. Doing it, you'll complete the auth-flow for Spotipy to get the Spotify token and save it in `.temp/spotipy.json`.

## Running

```bash
$ sudo python3 main.py
```