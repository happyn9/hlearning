import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from '../../context/UserContext';
import useTriggerWithProgress from '../../hooks/triggerWithProgress';
import api from '../../services/api';
import { useNavigate } from 'react-router';
import { useTranslation } from "react-i18next";

function Usermodal() {
  const { user, setUser } = useUser();  
  const userInitial = user?.name?.charAt(0)?.toUpperCase();
  const { trigger } = useTriggerWithProgress();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    trigger(async () => {
      try {
        await api.post("/auth/logout");
        setUser(null);
        navigate("/auth");
      } catch (err) {
        console.error(err);
        alert("Logout failed");
      }
    });
  };
const handleHblog = () => {
    trigger(async () => {
      navigate("/hblog");
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="absolute right-5 top-16 w-72 bg-white border border-gray-200 text-black rounded-2xl shadow-xl z-50"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-3">
            {t("modal.current")}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                {userInitial}
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-sm">{user?.name}</span>
                <span className="text-gray-500 text-xs">
                  {user?.email}
                </span>
              </div>
            </div>

            <ion-icon
              name="chevron-down-outline"
              className="text-gray-500 text-lg"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Blog */}
        <button onClick={handleHblog} className="w-full text-left px-4 py-3 text-gray-600 text-sm hover:bg-gray-100">
          {t("modal.blog")}
        </button>

        {/* Accounts */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs text-gray-500">
            {t("modal.accounts")}
          </p>
        </div>

        <button
          onClick={() => navigate('/myprofile')}
          className="w-full cursor-pointer text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          {t("modal.profile")}
        </button>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-2" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full cursor-pointer text-left px-4 py-3 text-sm hover:bg-gray-100"
        >
          {t("modal.logout")}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

export default Usermodal;