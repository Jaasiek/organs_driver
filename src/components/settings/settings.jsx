import "./settings.scss";
import ControlPanelHeader from "../controlPanelHeader/controlPanelHeader";
import { route } from "preact-router";
import { useEffect } from "react";

export default function Settings() {
  useEffect(() => {
    setTimeout(() => {
      route("/controlPanel");
    }, 4000);
  }, []);

  return (
    <div className="settings">
      <ControlPanelHeader />
      <h2>Nie masz dostępu do tej części</h2>
      <h4>Za chwilę zostaniesz automatycznie przekierowany na stronę główną</h4>
    </div>
  );
}
