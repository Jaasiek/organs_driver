import "./MIDI.scss";
import ControlPanelHeader from "../controlPanelHeader/controlPanelHeader";
import socket from "../../socket";
import { useState, useEffect } from "react";
import { Link } from "preact-router";

export default function MIDI() {
  const [root, setRoot] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [children, setChildren] = useState({});

  useEffect(() => {
    socket.emit("request_tree");
  }, []);

  useEffect(() => {
    socket.on("directory_tree", (tree) => {
      if (!root) {
        setRoot(tree);
        setChildren({ [tree.path]: tree });
      } else {
        setChildren((prev) => ({ ...prev, [tree.path]: tree }));
      }
    });

    socket.on("directory_tree_cleared", (payload) => {
      setRoot(null);
      setChildren({});
      setExpanded({});
    });

    return () => {
      socket.off("directory_tree");
      socket.off("connect");
      socket.off("directory_tree_cleared");
    };
  }, [root]);

  const toggleFolder = (folderPath) => {
    setExpanded((prev) => ({ ...prev, [folderPath]: !prev[folderPath] }));
    if (!children[folderPath]) {
      socket.emit("scan_folder_MIDI", { folder: folderPath });
    }
  };

  const renderTree = (node, depth = 0) => {
    if (!node) return null;

    const indent = 16;

    return (
      <div
        className="explorer"
        style={{
          width: `${100 - 2 * depth}%`,
        }}
      >
        {node.folders.map((folder) => {
          const folderPath = node.path + "/" + folder.name;
          const isOpen = !!expanded[folderPath];
          const folderChildren = children[folderPath];

          return (
            <div key={folderPath} className="folder-block">
              <div
                onClick={() => toggleFolder(folderPath)}
                className="directory"
                data-path={folderPath}
              >
                <div>
                  {isOpen ? "📂" : "📁"} {folder.name}
                </div>
              </div>

              {isOpen && renderTree(folderChildren, depth + 1)}
            </div>
          );
        })}

        <div className="files-list" style={{ marginTop: 6 }}>
          {node.files.map((f) => {
            const filePath = node.path + "/" + f;
            return (
              <div
                key={filePath}
                className="file"
                data-path={filePath}
                style={{ paddingLeft: depth * indent }}
              >
                <div className="name">🎵 {f}</div>
                <Link
                  href={`/controlPanel/MIDI/playMode?filePath=${encodeURIComponent(
                    filePath
                  )}&fileName=${encodeURIComponent(f)}`}
                  className="button"
                >
                  Graj
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!root)
    return (
      <div className="MIDI">
        <ControlPanelHeader />
        <h2>Podłącz dysk USB aby przeglądać pliki</h2>
      </div>
    );

  return (
    <div className="MIDI">
      <ControlPanelHeader />
      <h2>Wybierz utwór, który chcesz odtworzyć</h2>
      {renderTree(root)}
    </div>
  );
}
