import "./gameMode.scss";
import socket from "../../socket";
import { useEffect, useState } from "react";
import ControlPanelHeader from "../controlPanelHeader/controlPanelHeader";

export default function GameMode() {
  const [mode, setMode] = useState("▶");
  const [title, setTitle] = useState(".");

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
    }, 500);
  }, []);

  return (
    <div className="gameMode">
      <ControlPanelHeader />
      <h1>{title}</h1>
      <button
        className="mode"
        onClick={() => {
          if (mode == "▶") {
            setMode("⏸");
          } else {
            setMode("▶");
          }
          startPlaying();
        }}
      >
        {mode}
      </button>
      <div className="cordsTable">
        <div className="cords" id="pedal">
          <h4>Pedał</h4>
          <div className="cord" id="pedal1"></div>
          <div className="cord" id="pedal2"></div>
          <div className="cord" id="pedal3" v></div>
          <div className="cord" id="pedal4"></div>
        </div>
        <div className="cords" id="manualST">
          <h4>Manuał I</h4>
          <div className="cord" id="manualST1"></div>
          <div className="cord" id="manualST2"></div>
          <div className="cord" id="manualST3" v></div>
          <div className="cord" id="manualST4"></div>
        </div>
        <div className="cords" id="manualND">
          <h4>Manuał II</h4>
          <div className="cord" id="manualND1"></div>
          <div className="cord" id="manualND2"></div>
          <div className="cord" id="manualND3" v></div>
          <div className="cord" id="manualND4"></div>
        </div>
      </div>
      <div className="buttons">
        <button onClick={previoustStep}>◀</button>
        <button onClick={nextStep}>▶</button>
      </div>
    </div>
  );
}
