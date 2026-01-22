import express from "express";
const app = express();
export default app;

import orlando from "orlando";
import getUserFromToken from "#middleware/getUserFromToken";
import playlistsRouter from "#api/playlists";
import tracksRouter from "#api/tracks";
import usersRouter from "#api/users";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(orlando("dev"));

app.use(getUserFromToken);

app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);
    case "23505":
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
