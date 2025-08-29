import "./gameMode.scss";
import socket from "../../socket";
import { useEffect, useState } from "react";
import ControlPanelHeader from "../controlPanelHeader/controlPanelHeader";
import CordsTable from "../cordsTable/cordsTable";

export default function GameMode() {
  const [mode, setMode] = useState("▶");
  const [title, setTitle] = useState(".");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    socket.emit("registers_reset");
  }, []);

  function startPlaying() {
    socket.emit("start_playing");
  }

  function previoustStep() {
    socket.emit("previoust_step");
  }

  function nextStep() {
    socket.emit("next_step");
  }

  useEffect(() => {
    setTimeout(() => {
      setTitle(sessionStorage.getItem("title"));
    }, 10);
  }, []);

  return (
    <div className="gameMode">
      <ControlPanelHeader />
      <div className="info">
        <h1>{title}</h1>
        <button
          className="mode"
          onClick={() => {
            if (mode == "▶") {
              setMode("⏸");
              setIsPlaying(true);
            } else {
              setMode("▶");
            }
            {
              !isPlaying && startPlaying();
            }
          }}
        >
          {mode}
        </button>
      </div>
      <CordsTable playing={true} />
      <div className="buttons">
        <button onClick={previoustStep}>◀</button>
        <button onClick={nextStep}>▶</button>
      </div>
    </div>
  );
}
