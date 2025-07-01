import Router from "preact-router";
import "./app.scss";

import Dashboard from "./dashboard";
import ControlPanel from "./controlPanel";
import GameMode from "./components/gameMode/gameMode";
import Tracks from "./components/tracks/tracks";
import Combinations from "./components/combinations/combinations";
import MIDI from "./components/MIDI/MIDI";
import UserProfile from "./components/userProfile/userProfile";
import Settings from "./components/settings/settings";
import Sharable from "./components/sharable/sharable";

export function App() {
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
    </div>
  );
}
