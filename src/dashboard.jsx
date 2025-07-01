import "./dashboard.scss";
import DashboardHeader from "./components/dashboardHeader/dashboardHeader";
import { useState, useEffect } from "react";
import socket from "./socket";

export default function Dashboard() {
  const [steps, setSteps] = useState("0/0");
  const [connection, setConnections] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const handlePlay = (data) => {
      setTitle(data.title);
    };

    const handlePrevioustStep = (data) => {
      if (data.success === true) {
        setSteps(data.steps);
      }
    };

    const handleNextStep = (data) => {
      if (data.success === true) {
        setSteps(data.steps);
      }
    };

    socket.on("track_selected", () => {
      setSteps("0/12");
    });

    socket.on("play", handlePlay);
    socket.on("previoust_step_info", handlePrevioustStep);
    socket.on("next_step_info", handleNextStep);
    setConnections(["P-I", "P-II", "I-II", "Tremolo"]);
    return () => {
      socket.off("play", handlePlay);
      socket.off("previoust_step_info", handlePrevioustStep);
      socket.off("next_step_info", handleNextStep);
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
          <div className="cresStep" id="cres1"></div>
          <div className="cresStep" id="cres2"></div>
          <div className="cresStep" id="cres3"></div>
          <div className="cresStep" id="cres4"></div>
          <div className="cresStep" id="cres5"></div>
          <div className="cresStep" id="cres6"></div>
          <div className="cresStep" id="cres7"></div>
          <div className="cresStep" id="cres8"></div>
          <div className="cresStep" id="cres9"></div>
          <div className="cresStep" id="cres10"></div>
          <div className="cresStep" id="cres11"></div>
          <div className="cresStep" id="cres12"></div>
        </div>
      </div>
    </div>
  );
}
