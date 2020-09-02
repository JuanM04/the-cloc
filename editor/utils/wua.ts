import { WUAData } from "utils/types";
import { getHost } from "utils/storage";

export const get = async (): Promise<WUAData> => {
  const res = await fetch(`https://${getHost()}:5000`);
  return await res.json();
};

export const update = async (
  data: {
    [key in keyof WUAData]?: WUAData[key];
  }
): Promise<WUAData> => {
  const res = await fetch(`https://${getHost()}:5000`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
};

const WUA = { get, update };

export default WUA;
