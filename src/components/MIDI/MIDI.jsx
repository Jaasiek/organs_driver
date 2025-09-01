import "./MIDI.scss";
import ControlPanelHeader from "../controlPanelHeader/controlPanelHeader";
import socket from "../../socket";

export default function MIDI() {
  return (
    <div className="MIDI">
      <ControlPanelHeader />
      <h2>MIDI</h2>
      <button
        onClick={() => {
          socket.emit("MIDI");
        }}
      >
        Graj
      </button>
    </div>
  );
}
