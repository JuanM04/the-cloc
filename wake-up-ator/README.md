<h1 align="center">The Cloc</h1>
<p align="center"><b>Wake-up-ator</b></p>

## Installation

```bash
$ sudo apt install ffmpeg
$ sudo pip3 install adafruit-circuitpython-neopixel==6.0.0 \
                    ffmpeg-python==0.2.0 \
                    Flask==1.1.2 \ 
                    Flask-Cors==3.0.8 \
                    pyalsaaudio==0.9.0 \
                    pydub==0.24.1 \
                    python-dotenv-0.14.0 \
                    requests==2.24.0 \
                    rpi-ws281x==4.2.4
$ sudo python3 -m pip install --force-reinstall adafruit-blinka==5.3.0
```

> **Why Sudo?**
> Because NeoPixels library needs root to be run, so all dependencies need to be installed using `sudo pip3 install` instead of `pip3 install`.

## Running

```bash
$ sudo python3 main.py
```

**Crontab**
```
15 * * * * /home/pi/the-cloc/main.sh
```

**Editor Service**
```
[Unit]
Description=The Cloc Editor Server
After=multi-user.target

[Service]
WorkingDirectory=/home/pi/the-cloc
User=USER
Type=idle
ExecStart=/usr/bin/python3 editor-server.py &> /dev/null
Restart=always

[Install]
WantedBy=multi-user.target
```

`main.sh`
```bash
cd /home/pi/the-cloc
sudo /usr/bin/python3 main.py > logs.txt
```