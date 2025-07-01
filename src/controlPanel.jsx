import "./controlPanel.scss";
import { Link } from "preact-router/match";
import { useEffect } from "react";
import socket from "./socket";
import ControlPanelHeader from "./components/controlPanelHeader/controlPanelHeader";

export default function ControlPanel() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    if (
      localStorage.getItem("isLogged") == undefined &&
      localStorage.getItem("username") == undefined
    ) {
      localStorage.setItem("username", "Tryb gościa");
    }

    return () => {
      socket.off("server_message");
    };
  }, []);

  return (
    <div className="controlPanel">
      <ControlPanelHeader />
      <Link className={"hyperlink"} href="/controlPanel/gameMode">
        TRYB GRY
      </Link>
      <Link className={"hyperlink"} href="/controlPanel/tracks">
        UTWORY
      </Link>
      <Link className={"hyperlink"} href="/controlPanel/combinations">
        KOMBINACJE
      </Link>
      <Link className={"hyperlink"} href="/controlPanel/MIDI">
        MIDI
      </Link>
      <Link className={"hyperlink"} href="/controlPanel/userProfile">
        KONTO UŻYTKOWNIKA
      </Link>
      <Link className={"hyperlink"} href="/controlPanel/settings">
        USTAWIENIA SYSTEMOWE
      </Link>
    </div>
  );
}
