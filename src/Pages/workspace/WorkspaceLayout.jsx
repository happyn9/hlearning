import React, { useState, useEffect } from "react";
import { Home, Settings, MessageCircle, Zap, Folder } from "lucide-react";
import Messages from "./compo/Messages";
import Folders from "./compo/Folders";
import Setting from "./compo/Setting";
import { useUser } from "../../context/UserContext";
import { useParams } from "react-router";
import api from "../../services/api";
import WorkspaceChatAI from "./WorkspaceChatAI";
import WorkHome from "./compo/WorkHome";

function WorkspaceLayout() {
  const [selectedMenu, setSelectMenu] = useState("home");
  const [workspace, setWorkspace] = useState(null); // infos du workspace
  const { user } = useUser();
  const { id } = useParams();

  useEffect(() => {
  const fetchWorkspace = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/workspaces/${id}`);
      setWorkspace(res); // ✅ utiliser res.data
    } catch (err) {
      console.error("Error fetching workspace:", err);
    }
  };
  fetchWorkspace();
}, [id]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-20 bg-white flex flex-col items-center py-6 space-y-6 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
          {workspace ? workspace.name[0].toUpperCase() : "G"}
        </div>

        <nav className="flex flex-col space-y-6 text-gray-500">
          {[
            { key: "home", icon: Home },
            { key: "speed", icon: Zap },
            { key: "message", icon: MessageCircle },
            { key: "folder", icon: Folder },
            { key: "settings", icon: Settings },
          ].map((k) => {
            const ICON = k.icon;
            return (
              <button
                onClick={() => {
                  setSelectMenu(k.key);
                }}
                key={k.key}
                className={`${
                  k.key !== "speed" && k.key !== "folder"
                    ? "text-gray-500"
                    : "text-yellow-500"
                } ${selectedMenu === k.key && "bg-gray-200"} cursor-pointer p-2 rounded-lg hover:bg-gray-100`}
              >
                <ICON size={20} />
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 overflow-auto">
        {workspace ? (
          <>
            {selectedMenu === "home" && (
              <WorkHome workspace={workspace} />
            )}

            {selectedMenu === "message" && (
              <Messages workspace={workspace?.name || 'Workspace'} workspaceId={workspace.id} />
            )}

            {selectedMenu === "folder" && <Folders />}
            {selectedMenu === "settings" && <Setting workspace={workspace.name || "Workspace"} />}
          </>
        ) : (
          <p>Loading workspace...</p>
        )}
      </main>
    </div>
  );
}

export default WorkspaceLayout;
