export const getHost = (): string | null => localStorage.getItem("host");
export const setHost = (host: string): void =>
  localStorage.setItem("host", host);
