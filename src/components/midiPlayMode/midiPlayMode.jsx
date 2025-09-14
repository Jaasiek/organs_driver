import { useEffect, useState } from "react";
import ControlPanelHeader from "../controlPanelHeader/controlPanelHeader";
import CordsTable from "../cordsTable/cordsTable";
import "./midiPlayMode.scss";
import socket from "../../socket";
import { route } from "preact-router";

export default function MIDIPlayMode() {
  const params = new URLSearchParams(location.search);
  const filePath = params.get("filePath");
  const fileName = params.get("fileName").replace(".mid", "");
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [total, setTotal] = useState("");
  const [position, setPosition] = useState("");
  const [remaining, setRemaining] = useState("");
  const [showTimeLeft, setShowTimeLeft] = useState(false);

  useEffect(() => {
    socket.emit("MIDI_track", { fileName: fileName, filePath: filePath });
  }, []);

  useEffect(() => {
    const handleInfo = (data) => {
      setIsPlaying(data.is_playing);
      setIsPaused(data.is_paused);
      setTotal(data.total);
      setPosition(data.position);
      setRemaining(`-${data.remaining}`);
    };

    socket.on("midi_error", handleInfo);
    socket.on("midi_status", handleInfo);
    socket.on("midi_finished", () => {
      setIsStarted(false);
    });
    socket.on("directory_tree_cleared", () => {
      route("/controlPanel/MIDI");
    });

    return () => {
      socket.off("midi_error", handleInfo);
      socket.off("midi_status", handleInfo);
      socket.off("directory_tree_cleared");
    };
  }, []);

  return (
    <div className="MIDIPlayMode">
      <ControlPanelHeader />
      <div className="name">{fileName && <h1>{fileName}</h1>}</div>
      <div className="buttons">
        {isStarted && !isPaused ? (
          <button
            onClick={() => {
              socket.emit("MIDI_pause");
              setIsPaused(true);
            }}
            className="pausing"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="74px"
              viewBox="0 -960 960 960"
              width="74px"
              fill="#000000"
            >
              <path d="M525-200v-560h235v560H525Zm-325 0v-560h235v560H200Zm385-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => {
              if (!isStarted) {
                socket.emit("MIDI_start");
                setIsStarted(true);
              }
              socket.emit("MIDI_resume");
              setIsPaused(false);
            }}
            className="pausing"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="74px"
              viewBox="0 -960 960 960"
              width="74px"
              fill="#000000"
            >
              <path d="M320-203v-560l440 280-440 280Zm60-280Zm0 171 269-171-269-171v342Z" />
            </svg>
          </button>
        )}
        <button
          onClick={() => {
            socket.emit("MIDI_stop");
            route("/controlPanel/MIDI");
          }}
          className="action stop"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="74px"
            viewBox="0 -960 960 960"
            width="74px"
            fill="#000000"
          >
            <path d="M300-660v360-360Zm-60 420v-480h480v480H240Zm60-60h360v-360H300v360Z" />
          </svg>
        </button>
      </div>

      <div className="position">
        {position && total && (
          <h2>
            <b
              onClick={() => {
                setShowTimeLeft(!showTimeLeft);
              }}
            >
              {!showTimeLeft && position}
              {showTimeLeft && remaining}
            </b>
            <b>/{total}</b>
          </h2>
        )}
        {!position && (
          <h2>
            <b>00:00/00:00</b>
          </h2>
        )}
      </div>
      <CordsTable playing={true} />
    </div>
  );
}
