import "./dashboard.scss";
import DashboardHeader from "./components/dashboardHeader/dashboardHeader";
import { useState, useEffect } from "react";
import socket from "./socket";

export default function Dashboard() {
  const [steps, setSteps] = useState("0/0");
  const [connection, setConnections] = useState([]);
  const [title, setTitle] = useState("");
  const [cres, setCres] = useState(0);

  const toggleConnection = (id) => {
    setConnections((prev) => {
      const cordsSet = new Set(prev);
      if (cordsSet.has(id)) {
        cordsSet.delete(id);
      } else {
        cordsSet.add(id);
      }
      return Array.from(cordsSet);
    });
  };
  useEffect(() => {
    const handleSelectedTrack = (data) => {
      setSteps(`0/${data.steps}`);
      setConnections([]);
      setTitle(data.title);
    };

    const handlePrevioustStep = (data) => {
      if (data.success === true) {
        setSteps(data.steps);
        setConnections([]);
        if (data.combination.includes(100)) {
          toggleConnection("P-I");
        }
        if (data.combination.includes(101)) {
          toggleConnection("P-II");
        }
        if (data.combination.includes(102)) {
          toggleConnection("I-II");
        }
        if (data.combination.includes(103)) {
          toggleConnection("Tremolo");
        }
      }
    };

    const handleNextStep = (data) => {
      if (data.success === true) {
        setSteps(data.steps);
        setConnections([]);
        if (data.combination.includes(100)) {
          toggleConnection("P-I");
        }
        if (data.combination.includes(101)) {
          toggleConnection("P-II");
        }
        if (data.combination.includes(102)) {
          toggleConnection("I-II");
        }
        if (data.combination.includes(103)) {
          toggleConnection("Tremolo");
        }
      }
    };

    const handlePlay = (data) => {
      if (data.success === true) {
        setSteps(data.steps);
        setConnections([]);
        if (data.combination.includes(100)) {
          toggleConnection("P-I");
        }
        if (data.combination.includes(101)) {
          toggleConnection("P-II");
        }
        if (data.combination.includes(102)) {
          toggleConnection("I-II");
        }
        if (data.combination.includes(103)) {
          toggleConnection("Tremolo");
        }
      }
    };

    const handleCrescendo = (data) => {
      setCres(data.cres / 4);
    };

    socket.on("track_selected", handleSelectedTrack);

    socket.on("play", handlePlay);
    socket.on("previoust_step_info", handlePrevioustStep);
    socket.on("next_step_info", handleNextStep);
    socket.on("crescendo", handleCrescendo);
    return () => {
      socket.off("play", handlePlay);
      socket.off("previoust_step_info", handlePrevioustStep);
      socket.off("next_step_info", handleNextStep);
      socket.off("crescendo", handleCrescendo);
    };
  }, []);

  return (
    <div className="dashboard">
      <DashboardHeader />
      <div className="steps">
        <h1>{steps}</h1>
      </div>
      <div className="connections">
        {connection.map((conn, index) => (
          <div className="connection" key={index}>
            {conn}
          </div>
        ))}
      </div>
      <div className="title">
        <h1>{title}</h1>
      </div>
      <div className="crescendo">
        <h1>Crescendo</h1>
        <div className="cres">
          <div className={`cresStep ${1 <= cres ? "active" : ""}`}></div>
          <div className={`cresStep ${2 <= cres ? "active" : ""}`}></div>
          <div className={`cresStep ${3 <= cres ? "active" : ""}`}></div>
          <div className={`cresStep ${4 <= cres ? "active" : ""}`}></div>
          <div className={`cresStep ${5 <= cres ? "active" : ""}`}></div>
          <div className={`cresStep ${6 <= cres ? "active" : ""}`}></div>
          <div className={`cresStep ${7 <= cres ? "active" : ""}`}></div>
          <div className={`cresStep ${8 <= cres ? "active" : ""}`}></div>
          <div className={`cresStep ${9 <= cres ? "active" : ""}`}></div>
          <div className={`cresStep ${10 <= cres ? "active" : ""}`}></div>
          <div className={`cresStep ${11 <= cres ? "active" : ""}`}></div>
          <div className={`cresStep ${12 <= cres ? "active" : ""}`}></div>
        </div>
      </div>
    </div>
  );
}
