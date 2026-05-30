import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../context/UserContext";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    program: "",
    university: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        program: user?.onboarding?.program || "",
        university: user?.onboarding?.university || "",
        bio: user?.bio || "",
      });
    }
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/user/profile", formData);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen bg-linear-to-br from-black via-neutral-900 to-black text-white p-6 md:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t("profile.title")}
          </h2>

          <button
            onClick={() => navigate("/")}
            className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-xl transition"
          >
            ✕
          </button>
        </div>

        {/* MAIN */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          {/* LEFT */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-neutral-900/70 p-6 rounded-2xl border border-neutral-800"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-linear-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-4xl font-bold mb-4">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{user?.email}</p>

              <div className="mt-6 w-full">
                <p className="text-gray-400 text-sm mb-2">{t("profile.bio")}</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {formData.bio || t("profile.noBio")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="md:col-span-2 bg-neutral-900/70 p-8 rounded-2xl border border-neutral-800"
          >
            <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <FloatingInput
                label={t("profile.name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <FloatingInput
                label={t("profile.email")}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <textarea
                className="col-span-1 md:col-span-2 w-full py-3 px-4 bg-neutral-800 border border-neutral-700 rounded-xl"
                placeholder={t("profile.bioPlaceholder")}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />

              <FloatingSelect
                isuniv
                label={t("profile.university")}
                value={formData.university}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    university: e.target.value,
                    program: "",
                  })
                }
              />

              <FloatingSelect
                label={t("profile.program")}
                isuniv={false}
                nameUniv={formData.university}
                value={formData.program}
                disabled={!formData.university}
                onChange={(e) =>
                  setFormData({ ...formData, program: e.target.value })
                }
              />

              <button
                type="submit"
                className="col-span-1 md:col-span-2 bg-linear-to-r from-amber-400 to-yellow-600 text-black font-semibold py-3 rounded-xl"
              >
                {t("profile.save")}
              </button>
            </form>
          </motion.div>
        </div>

        {/* FOOTER */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} h-learning — {t("profile.footer")}
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}