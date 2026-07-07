import React, { useState, useEffect } from "react";
import { Home, Settings, MessageCircle, Zap, Folder } from "lucide-react";
import Messages from "./compo/Messages";
import Folders from "./compo/Folders";
import Setting from "./compo/Setting";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router";
import api from "../../services/api";
import WorkHome from "./compo/WorkHome";

const NAV_ITEMS = [
  { key: "home", icon: Home, label: "Accueil" },
  { key: "speed", icon: Zap, label: "Rapide" },
  { key: "message", icon: MessageCircle, label: "Messages" },
  { key: "folder", icon: Folder, label: "Fichiers" },
  { key: "settings", icon: Settings, label: "Réglages" },
];

function WorkspaceLayout() {
  const [selectedMenu, setSelectMenu] = useState("home");
  const [workspace, setWorkspace] = useState(null);
  const { user } = useUser();
  const { id } = useParams();

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/workspaces/${id}`);
        setWorkspace(res);
      } catch (err) {
        console.error("Error fetching workspace:", err);
      }
    };
    fetchWorkspace();
  }, [id]);

  return (
    // On mobile: nav en bas (flex-col-reverse), sur md+: nav à gauche (flex-row)
    <div className="flex flex-col-reverse md:flex-row h-[100dvh] bg-gray-50 overflow-hidden">
      {/* Sidebar / bottom nav */}
      <aside
        className="
          w-full md:w-20 shrink-0
          bg-white shadow-sm
          flex flex-row md:flex-col items-center
          justify-around md:justify-start
          py-2 md:py-6
          px-2 md:px-0
          gap-0 md:gap-6
          border-t md:border-t-0 md:border-r border-gray-100
        "
      >
        {/* Logo — masqué sur mobile pour laisser la place aux icônes */}
        <div className="hidden md:flex w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-indigo-500 items-center justify-center text-white font-bold">
          {workspace ? workspace.name[0].toUpperCase() : "G"}
        </div>

        <nav className="flex flex-row md:flex-col w-full md:w-auto justify-around md:justify-start md:space-y-6 text-gray-500">
          {NAV_ITEMS.map((k) => {
            const ICON = k.icon;
            const active = selectedMenu === k.key;
            return (
              <button
                onClick={() => setSelectMenu(k.key)}
                key={k.key}
                aria-label={k.label}
                className={`
                  ${k.key === "speed" || k.key === "folder" ? "text-yellow-500" : "text-gray-500"}
                  ${active ? "bg-gray-200" : ""}
                  flex flex-col md:block items-center gap-0.5
                  cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors
                `}
              >
                <ICON size={20} />
                <span className="text-[10px] md:hidden leading-none">{k.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-auto">
        {workspace ? (
          <>
            {selectedMenu === "home" && <WorkHome workspace={workspace} />}
            {selectedMenu === "message" && (
              <Messages workspace={workspace?.name || "Workspace"} workspaceId={workspace.id} />
            )}
            {selectedMenu === "folder" && <Folders />}
            {selectedMenu === "settings" && (
              <Setting workspace={workspace.name || "Workspace"} />
            )}
          </>
        ) : (
          <p>Loading workspace...</p>
        )}
      </main>
    </div>
  );
}

export default WorkspaceLayout;