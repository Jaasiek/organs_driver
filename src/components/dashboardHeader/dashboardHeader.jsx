import "./dashboardHeader.scss";
import { Clock } from "../clock/clock";
import { useState } from "react";
import socket from "../../socket";

export default function DashboardHeader() {
  const [info, setInfo] = useState("");
  setInfo("TUTTI");

  return (
    <div className="dashboardHeader">
      <Clock />
      <p className={`${info == "TUTTI" ? "tutti" : "info"}`}>{info}</p>
    </div>
  );
}
