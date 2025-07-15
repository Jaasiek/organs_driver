import { useEffect, useState } from "react";
import { Link } from "preact-router/match";
import ControlPanelHeader from "../controlPanelHeader/controlPanelHeader";
import Sharable from "../sharable/sharable";
import "./tracks.scss";
import socket from "../../socket";

export default function Tracks() {
  const [tracks, setTracks] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [openSharableTrack, setOpenSharableTrack] = useState(null);
  const [togglePopUp, setTogglePopUp] = useState(true);

  function play(trackName) {
    socket.emit("select_track", { track_name: trackName });
  }

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLogged");
    if (loggedIn === "true") {
      setIsLogged(true);
      setUsername(localStorage.getItem("username"));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (username) {
      socket.emit("get_tracks", username);
    }

    const handleTracks = (data) => {
      const tracksArray = Object.values(data);
      setTracks(tracksArray);
    };

    socket.on("tracks", handleTracks);

    return () => {
      socket.off("tracks", handleTracks);
    };
  }, [username]);

  useEffect(() => {}, [tracks]);

  if (loading) {
    return null;
  }
  useEffect(() => {
    socket.on("track_selected", (data) => {
      sessionStorage.setItem("title", data.title);
    });
  }, []);

  return (
    <div className="tracks">
      <ControlPanelHeader />
      {!isLogged && <p>Musisz być zalogowany, aby przeglądać swoje utwory</p>}
      {isLogged &&
        tracks.map((track) => (
          <div className="track" id={track.name} key={track.name}>
            <p>{track.name}</p>
            <Link
              href="/controlPanel/gameMode"
              className={"hyperlink"}
              onClick={() => play(track.name)}
            >
              ▶
            </Link>
            <button
              onClick={() => {
                setOpenSharableTrack(track.name);
                setTogglePopUp(true);
              }}
            >
              ...
            </button>

            {openSharableTrack === track.name && togglePopUp && (
              <Sharable
                trackName={track.name}
                onClose={() => setTogglePopUp(false)}
              />
            )}
          </div>
        ))}
    </div>
  );
}
