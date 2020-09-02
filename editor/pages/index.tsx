import { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Input,
  Spacer,
  Spinner,
  User,
  useToasts,
} from "@geist-ui/react";

import Alarm from "components/Alarm";
import Days from "components/Days";
import Music from "components/Music";
import PlayTime from "components/PlayTime";

import WUA from "utils/wua";
import { WUAData } from "utils/types";
import { getHost, setHost } from "utils/storage";

const Homepage = () => {
  const [bedtime, setBedtime] = useState<WUAData["bedtime"]>([0, 0]);
  const [wakeup, setWakeup] = useState<WUAData["wakeup"]>([0, 0]);
  const [days, setDays] = useState<WUAData["days"]>([]);
  const [musicURI, setMusicURI] = useState<WUAData["musicURI"]>("");
  const [playTime, setPlayTime] = useState<WUAData["playTime"]>(0);
  const [volume, setVolume] = useState<WUAData["volume"]>(0);
  const [spotifyAccount, setSpotifyAccount] = useState<WUAData["spotify"]>(
    null
  );

  const [, setToast] = useToasts();
  const [inputHost, setInputHost] = useState<string | null>(null);
  const [getting, setGetting] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (getHost() === null) {
      setGetting(false);
      setInputHost("");
      return;
    }

    WUA.get()
      .then((data) => {
        console.log(data);
        setBedtime(data.bedtime);
        setWakeup(data.wakeup);
        setDays(data.days);
        setMusicURI(data.musicURI);
        setPlayTime(data.playTime);
        setVolume(data.volume);
        setSpotifyAccount(data.spotify);
      })
      .catch((_) => {
        setToast({
          type: "error",
          text: "The Cloc wasn't found in your network",
        });
        setInputHost(getHost());
      })
      .finally(() => setGetting(false));
  }, []);

  return (
    <main>
      <h1 style={{ textAlign: "center" }}>The Cloc</h1>

      {getting ? (
        <Grid.Container justify="center">
          <Spinner size="large" />
        </Grid.Container>
      ) : inputHost !== null ? (
        <Grid.Container justify="center" alignItems="center" direction="column">
          <Input
            value={inputHost}
            placeholder="thecloc.local"
            label="http://"
            onChange={(e) => setInputHost(e.currentTarget.value.trim())}
          />
          <Spacer y={1} />
          <Button
            type="success"
            auto
            size="small"
            onClick={() => {
              setHost(inputHost);
              window.location.reload();
            }}
          >
            Go!
          </Button>
        </Grid.Container>
      ) : !spotifyAccount ? (
        <Grid.Container justify="center">
          <Button
            type="success"
            auto
            onClick={() => window.location.replace("/api/login")}
          >
            Login with Spotify
          </Button>
        </Grid.Container>
      ) : (
        <>
          <Grid.Container justify="space-between" alignItems="center">
            <User
              src={spotifyAccount.photo}
              text={spotifyAccount.name[0]}
              name={spotifyAccount.name}
              style={{ paddingLeft: 0 }}
            />
            <Button
              type="error"
              size="mini"
              auto
              ghost
              onClick={() => {
                setUpdating(true);

                WUA.update({ spotify: null })
                  .then((_) => window.location.reload())
                  .catch((_) => {
                    setToast({
                      type: "error",
                      text: "There was an error",
                    });
                    setUpdating(false);
                  });
              }}
            >
              Exit
            </Button>
          </Grid.Container>
          <br />
          <Alarm
            bedtime={bedtime}
            setBedtime={setBedtime}
            wakeup={wakeup}
            setWakeup={setWakeup}
            disabled={updating}
          />
          <br />
          <Days days={days} setDays={setDays} disabled={updating} />
          <br />
          <Music
            musicURI={musicURI}
            setMusicURI={setMusicURI}
            disabled={updating}
          />
          <br />
          <PlayTime
            playTime={playTime}
            setPlayTime={setPlayTime}
            volume={volume}
            setVolume={setVolume}
            disabled={updating}
          />
          <br />
          <Grid.Container justify="center">
            <Button
              type="success"
              auto
              shadow
              onClick={async () => {
                setUpdating(true);

                try {
                  if (musicURI.length === 0) throw "Missing music URI";
                  if (bedtime[0] === wakeup[0] && bedtime[1] === wakeup[1])
                    throw "Bedtime has to different to Wake-up";
                  if (days.length === 0)
                    throw "There hast to be at lest one day selected";
                  if (playTime < 1 || playTime > 30)
                    throw "Play Time has to be between 1 and 30 seconds";

                  const uriIsValidRes = await fetch("/api/check-uri", {
                    method: "post",
                    body: JSON.stringify({
                      uri: musicURI,
                      auth: spotifyAccount,
                    }),
                    headers: { "Content-Type": "application/json" },
                  });
                  const uriIsValid = await uriIsValidRes.json();

                  if (!uriIsValid?.valid)
                    throw "The Spotify URI is invalid.\n Any change was saved";

                  await WUA.update({
                    bedtime,
                    wakeup,
                    days,
                    musicURI,
                    playTime,
                    volume,
                  });
                  setToast({
                    type: "success",
                    text: "Saved!",
                  });
                } catch (error) {
                  setToast({
                    type: "error",
                    text:
                      typeof error === "string" ? error : "There was an error",
                  });
                } finally {
                  setUpdating(false);
                }
              }}
              loading={updating}
            >
              Save
            </Button>
          </Grid.Container>
        </>
      )}
    </main>
  );
};

export default Homepage;
