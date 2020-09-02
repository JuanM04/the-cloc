import { HOURS, MINUTES, DAYS } from "utils/consts";

export type Hour = typeof HOURS[number];
export type Minute = typeof MINUTES[number];

export type Day = typeof DAYS[number];

export type WUAData = {
  bedtime: [hour: Hour, minute: Minute];
  wakeup: [Hour, Minute];
  days: Day[];
  musicURI: string;
  playTime: number;
  volume: number;
  spotify: {
    name: string;
    photo: string | null;
    accessToken: string;
    refreshToken: string;
  } | null;
};
