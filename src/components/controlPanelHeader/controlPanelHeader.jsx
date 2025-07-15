import "./controlPanelHeader.scss";
import { Clock } from "../clock/clock";
import socket from "../../socket";
import { Link } from "preact-router/match";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";

export default function ControlPanelHeader() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [togglePopUp, setTogglePopUp] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setUsername(localStorage.getItem("username"));
    }, 5);
  }, []);

  useEffect(() => {
    const handleShared = (data) => {
      setMessage(data.message);
      setFadeOut(false);
      setTogglePopUp(true);

      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setTogglePopUp(false);
        }, 500);
      }, 3000);
    };

    const handleMessage = (data) => {
      if (data.success === false) {
        setMessage(data.message);
        setFadeOut(false);
        setTogglePopUp(true);

        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setTogglePopUp(false);
          }, 500);
        }, 3000);
      }
    };

    const handleTrueFalseMessage = (data) => {
      setMessage(data.message);
      setFadeOut(false);
      setTogglePopUp(true);

      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setTogglePopUp(false);
        }, 500);
      }, 3000);
    };

    socket.on("shared", handleShared);
    socket.on("previoust_step_info", handleMessage);
    socket.on("next_step_info", handleMessage);
    socket.on("creating_track_info", handleTrueFalseMessage);
    socket.on("combination_creating_info", handleTrueFalseMessage);
    socket.on("combination_editing_info", handleTrueFalseMessage);
    socket.on("previoust_step_edit", handleMessage);

    return () => {
      socket.off("shared", handleShared);
      socket.off("previoust_step_info", handleMessage);
      socket.off("next_step_info", handleMessage);
      socket.off("creating_track_info", handleTrueFalseMessage);
      socket.off("combination_creating_info", handleTrueFalseMessage);
      socket.off("previoust_step_edit", handleMessage);
      socket.off("combination_editing_info", handleTrueFalseMessage);
    };
  }, []);

  useEffect(() => {
    const handleChange = () => {
      setUsername(localStorage.getItem("username"));
    };

    window.addEventListener("usernameChange", handleChange);
    return () => window.removeEventListener("usernameChange", handleChange);
  }, []);

  return (
    <div className="controlPanelHeader">
      <Link href="/controlPanel">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <p>{username}</p>
      <Clock />
      {togglePopUp && (
        <div className={`message ${fadeOut ? "fadeOut" : ""}`}>
          <h1>{message}</h1>
        </div>
      )}
    </div>
  );
}
