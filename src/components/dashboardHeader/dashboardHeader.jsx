import "./dashboardHeader.scss";
import { Clock } from "../clock/clock";

export default function DashboardHeader({ info }) {
  return (
    <div className="dashboardHeader">
      <Clock />
      <p className={`${info == "TUTTI" ? "tutti" : "info"}`}>{info}</p>
    </div>
  );
}
