import { useEffect } from "react";
import { useRouter } from "next/router";
import { Grid, Spinner, useToasts } from "@geist-ui/react";
import WUA from "utils/wua";

const SpotifyCallback = () => {
  const router = useRouter();
  const [, setToast] = useToasts();

  const error = () => {
    setToast({
      type: "error",
      text: "There was an error. Redirecting...",
      delay: 5000,
    });
    setTimeout(() => router.replace("/"), 5000);
  };

  useEffect(() => {
    if (!router.asPath.includes("?code=")) {
      error();
      return;
    }

    const code = router.asPath.split("?code=", 2)[1].split("&", 2)[0];

    if (code.trim() === "") {
      error();
      return;
    }

    fetch("/api/login-callback", {
      method: "POST",
      body: code,
      headers: { "Content-Type": "text/plain" },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else {
          res.json().then(console.error);
          throw null;
        }
      })
      .then((data) => WUA.update({ spotify: data }))
      .then((_) => {
        router.replace("/");
      })
      .catch(error);
  }, []);

  return (
    <main>
      <h3 style={{ textAlign: "center" }}>Please wait...</h3>

      <Grid.Container justify="center">
        <Spinner size="large" />
      </Grid.Container>
    </main>
  );
};

export default SpotifyCallback;
