import { Card, Select, Grid, Container } from "@geist-ui/react";
import { HOURS, MINUTES } from "utils/consts";
import { Hour, Minute } from "utils/types";

const zeros = (n: number, z: number) => {
  let accum = "" + n;
  while (z > accum.length) {
    accum = "0" + accum;
  }
  return accum;
};

const Alarm = ({
  bedtime,
  setBedtime,
  wakeup,
  setWakeup,
  disabled = false,
}: {
  bedtime: [Hour, Minute];
  setBedtime(time: [Hour, Minute]): any;
  wakeup: [Hour, Minute];
  setWakeup(time: [Hour, Minute]): any;
  disabled?: boolean;
}) => (
  <Card>
    <h4>Alarm</h4>

    <Grid.Container justify="space-between" direction="row">
      <Time
        label="Bedtime"
        time={bedtime}
        setTime={setBedtime}
        disabled={disabled}
      />
      <Time
        label="Wake-up"
        time={wakeup}
        setTime={setWakeup}
        disabled={disabled}
      />
    </Grid.Container>
  </Card>
);

const Time = ({
  time,
  setTime,
  label,
  disabled = false,
}: {
  time: [Hour, Minute];
  setTime(time: [Hour, Minute]): any;
  label: string;
  disabled?: boolean;
}) => (
  <Grid.Container style={{ width: "45%" }}>
    <p style={{ margin: 0 }}>{label}</p>

    <Grid.Container justify="space-between" direction="row">
      <Select
        placeholder="Hour"
        initialValue={time[0].toString()}
        style={{ minWidth: "47.5%" }}
        onChange={(selected) => {
          if (typeof selected === "object") return;
          setTime([parseInt(selected) as Hour, time[1]]);
        }}
        disabled={disabled}
      >
        {HOURS.map((h) => (
          <Select.Option key={h} value={h.toString()}>
            {zeros(h, 2)}
          </Select.Option>
        ))}
      </Select>
      <Select
        placeholder="Minutes"
        initialValue={time[1].toString()}
        style={{ minWidth: "47.5%" }}
        onChange={(selected) => {
          if (typeof selected === "object") return;
          setTime([time[0], parseInt(selected) as Minute]);
        }}
        disabled={disabled}
      >
        {MINUTES.map((m) => (
          <Select.Option key={m} value={m.toString()}>
            {zeros(m, 2)}
          </Select.Option>
        ))}
      </Select>
    </Grid.Container>
  </Grid.Container>
);

export default Alarm;
