import "./dashboard.scss";
import DashboardHeader from "./components/dashboardHeader/dashboardHeader";
import { useState, useEffect } from "react";
import socket from "./socket";

export default function Dashboard() {
  const [steps, setSteps] = useState("0/0");
  const [connection, setConnections] = useState([]);
  const [title, setTitle] = useState("");
  const [cres, setCres] = useState(0);
  const [info, setInfo] = useState("");

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
      setInfo((prevInfo) => (prevInfo === "TUTTI" ? "" : prevInfo));
      if (data.steps) {
        setSteps(`0/${data.steps}`);
      } else {
        setSteps("0/0");
      }
      setConnections([]);
      setTitle(data.title);
    };

    const handleSteps = (data) => {
      setInfo((prevInfo) => (prevInfo === "TUTTI" ? "" : prevInfo));
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
        if (data.combination.includes(17)) {
          toggleConnection("Tremolo");
        }
      }
    };

    const handleRegisters = (data) => {
      setInfo((prevInfo) => (prevInfo === "TUTTI" ? "" : prevInfo));
      if (data.number == 100) {
        toggleConnection("P-I");
      }
      if (data.number == 101) {
        toggleConnection("P-II");
      }
      if (data.number == 102) {
        toggleConnection("I-II");
      }
      if (data.number == 17) {
        toggleConnection("Tremolo");
      }
    };

    const handleCrescendo = (data) => {
      setCres(data.cres / 4);
    };

    const handleTUTTI = () => {
      setConnections(["P-I", "P-II", "I-II"]);
      setInfo("TUTTI");
    };

    const handleCancel = () => {
      console.log("Cancel received");
      setConnections([]);
      setInfo("");
    };

    const handleHome = () => {
      setConnections([]);
      setSteps("0/0");
      setTitle("");
      setInfo("");
    };

    socket.on("track_selected", handleSelectedTrack);

    socket.on("play", handleSteps);
    socket.on("previoust_step_info", handleSteps);
    socket.on("next_step_info", handleSteps);
    socket.on("crescendo", handleCrescendo);
    socket.on("registers", handleRegisters);
    socket.on("TUTTI", handleTUTTI);
    socket.on("clear", handleCancel);
    socket.on("home_reset", handleHome);

    return () => {
      socket.off("play", handleSteps);
      socket.off("previoust_step_info", handleSteps);
      socket.off("next_step_info", handleSteps);
      socket.off("crescendo", handleCrescendo);
      socket.off("registers", handleRegisters);
      socket.off("TUTTI", handleTUTTI);
      socket.off("clear", handleCancel);
    };
  }, []);

  return (
    <div className="dashboard">
      <DashboardHeader info={info} />
      <div className="steps">
        <h1>{steps}</h1>
      </div>
      <div className="connections">
        {connection.includes("P-I") && <div className="connection">P-I</div>}
        {connection.includes("P-II") && <div className="connection">P-II</div>}
        {connection.includes("I-II") && <div className="connection">I-II</div>}
        {connection.includes("Tremolo") && (
          <div className="connection">Tremolo</div>
        )}
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
