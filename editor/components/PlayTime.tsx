import { Card, Input, Slider } from "@geist-ui/react";

const PlayTime = ({
  playTime,
  setPlayTime,
  volume,
  setVolume,
  disabled = false,
}: {
  playTime: number;
  setPlayTime(seconds: number): any;
  volume: number;
  setVolume(vol: number): any;
  disabled?: boolean;
}) => (
  <Card>
    <h4>Play Time</h4>

    <Input
      value={playTime === 0 ? "" : playTime.toString()}
      placeholder="0"
      onChange={({ currentTarget: { value } }) => {
        const seconds = parseInt(value);

        if (seconds) setPlayTime(seconds);
        else if (!seconds && value.trim() === "") setPlayTime(0);
      }}
      labelRight="seconds"
      disabled={disabled}
    />
    <p>Volume</p>
    <Slider step={10} showMarkers initialValue={volume} onChange={setVolume} />
  </Card>
);

export default PlayTime;
