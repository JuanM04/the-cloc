import { Card, Input } from "@geist-ui/react";

const Music = ({
  musicURI,
  setMusicURI,
  disabled = false,
}: {
  musicURI: string;
  setMusicURI(uri: string): any;
  disabled?: boolean;
}) => (
  <Card>
    <h4>Music</h4>

    <Input
      value={musicURI}
      placeholder="Spotify URI"
      width="100%"
      onChange={({ currentTarget: { value } }) => setMusicURI(value.trim())}
      disabled={disabled}
    />
  </Card>
);

export default Music;
