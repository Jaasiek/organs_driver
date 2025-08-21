import Router from "preact-router";
import "./app.scss";
import socket from "./socket";
import { useEffect, useState } from "react";

import Dashboard from "./dashboard";
import ControlPanel from "./controlPanel";
import GameMode from "./components/gameMode/gameMode";
import Tracks from "./components/tracks/tracks";
import Combinations from "./components/combinations/combinations";
import MIDI from "./components/MIDI/MIDI";
import UserProfile from "./components/userProfile/userProfile";
import Settings from "./components/settings/settings";

export function App() {
  const [info, setInfo] = useState(false);

  useEffect(() => {
    const handleShutDown = () => {
      setInfo(true);
    };

    socket.on("shutdown", handleShutDown);

    return () => {
      socket.off("shutdown", handleShutDown);
    };
  }, []);
  return (
    <div className="content">
      <Router>
        <ControlPanel path="/controlPanel" />
        <Dashboard path="/dashboard" />
        <GameMode path="/controlPanel/gameMode" />
        <Tracks path="/controlPanel/tracks" />
        <Combinations path="/controlPanel/combinations" />
        <MIDI path="/controlPanel/MIDI" />
        <UserProfile path="/controlPanel/userProfile" />
        <Settings path="/controlPanel/settings" />
      </Router>
      {info && (
        <div className="shuttingDown">
          <h1>Wyłączanie</h1>
        </div>
      )}
    </div>
  );
}
