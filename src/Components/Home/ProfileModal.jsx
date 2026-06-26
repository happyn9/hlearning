import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../context/UserContext";
import FloatingInput from "../FloatingInput";
import FloatingSelect from "../FloatingSelect";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import {
  User,
  WholeWord,
  Building2,
  Palette,
  BookOpen,
  Bell,
  Users,
  ChevronRight,
  Pen,
  ArrowLeft
  
} from "lucide-react";

export default function ProfileModal() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [messageNotif, setMessageNotif] = useState(false);
  const navigate = useNavigate();
  const {user}=useUser();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <button
            onClick={() => navigate("/")}
            className="bg-slate-600 fixed right-15 top-4 lg:top-5 hover:bg-neutral-300 cursor-pointer px-4 py-3 rounded-xl transition"
      >
        <ArrowLeft color="white" size={18} />
      </button>
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="mb-14">

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            {t("profile.title")}
          </h1>



          <p className="mt-3 text-slate-500 text-lg">
            Manage your H-learning account and preferences.
          </p>
        </div>

        {/* PROFILE */}
        <Section title="Profile">
          <Row>
            <div className="flex items-center gap-5">
              <div
                className="
                w-15 h-15
                rounded-full
                bg-slate-600
                flex items-center justify-center
                text-white
                text-2xl
                font-semibold
              "
              >
                {user?.name[0] || 'H'}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {user?.name}
                </h2>

                <p className="text-slate-500">
                  Student Account
                </p>
              </div>
            </div>
          </Row>

          <InputRow
            label="Full Name"
            placeholder={user?.name || 'Full Name'}
          />

          <InputRow
            label="Email"
            placeholder={user?.email || 'happy@gmail.com'}
          />
        </Section>

        {/* APPEARANCE */}
        <Section title="Appearance">
          <SelectRow
            icon={<Palette size={18} />}
            label="Theme"
            options={["Light", "Dark", "System"]}
          />

          <SelectRow
            icon={<WholeWord size={18} />}
            label="Language"
            options={["English", "French"]}
          />
        </Section>

        {/* LEARNING */}
        <Section title="Learning">
          <InputRow
            icon={<BookOpen size={18} />}
            label="Learning Goal"
            placeholder="Become a Fullstack Developer"
          />

          <InputRow
            icon={<Pen size={18} />}
            label="Study Time"
            placeholder="2 Hours Per Day"
          />

          <SelectRow
            label="Level"
            options={[
              "Beginner",
              "Intermediate",
              "Advanced",
            ]}
          />
        </Section>

        {/* NOTIFICATIONS */}
        <Section title="Notifications">
          <ToggleRow
            icon={<Bell size={18} />}
            label="Email Notifications"
            value={emailNotif}
            onChange={() =>
              setEmailNotif(!emailNotif)
            }
          />

          <ToggleRow
            label="Message Notifications"
            value={messageNotif}
            disabled={true}
            onChange={() =>
              setMessageNotif(!messageNotif)
            }
          />
        </Section>

        {/* COMMUNITY */}
        <Section title="Community">
          <ActionRow
            icon={<Users size={18} />}
            title="Study Groups"
          />

          <ActionRow
            title="Community Discussions"
          />
        </Section>

        {/* SAVE */}
        <div className="flex justify-center mt-12">
          <button
            className="
            px-8
            py-4
            rounded-full
            bg-black
            text-white
            font-medium
            hover:scale-[1.02]
            active:scale-[0.98]
            transition
          "
          >
            {t("profile.save")}
          </button>
        </div>
      </div>
      {/* FOOTER */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} h-learning — {t("profile.footer")}
      </footer>
    </div>
  );
}

/* ---------- SECTION ---------- */

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3
        className="
        text-xs
        uppercase
        tracking-[0.2em]
        text-slate-500
        mb-3
      "
      >
        {title}
      </h3>

      <div
        className="
        bg-white
        rounded-[28px]
        shadow-[0_2px_10px_rgba(0,0,0,0.04)]
        overflow-hidden
      "
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- ROW ---------- */

function Row({ children }) {
  return (
    <div className="px-6 py-5">
      {children}
    </div>
  );
}

/* ---------- INPUT ROW ---------- */

function InputRow({
  icon,
  label,
  placeholder,
}) {
  return (
    <div
      className="
      flex items-center
      gap-4
      px-6
      py-5
      border-b
      border-slate-100
      last:border-none
    "
    >
      {icon && (
        <div className="text-slate-500">
          {icon}
        </div>
      )}

      <div className="w-40 text-slate-700 font-medium">
        {label}
      </div>

      <input
        placeholder={placeholder}
        className="
        flex-1
        bg-transparent
        outline-none
        text-slate-900
        placeholder:text-slate-400
      "
      />
    </div>
  );
}

/* ---------- SELECT ROW ---------- */

function SelectRow({
  icon,
  label,
  options,
}) {
  return (
    <div
      className="
      flex items-center
      gap-4
      px-6
      py-5
      border-b
      border-slate-100
      last:border-none
    "
    >
      {icon && (
        <div className="text-slate-500">
          {icon}
        </div>
      )}

      <div className="w-40 text-slate-700 font-medium">
        {label}
      </div>

      <select
        className="
        flex-1
        bg-transparent
        outline-none
        text-slate-900
      "
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------- TOGGLE ---------- */

function ToggleRow({
  icon,
  label,
  value,
  onChange,
  disabled
}) {
  return (
    <div
      className="
      flex items-center
      justify-between
      px-6
      py-5
      border-b
      border-slate-100
      last:border-none
    "
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="text-slate-500">
            {icon}
          </div>
        )}

        <span className="text-slate-700 font-medium">
          {label}
        </span>
      </div>

      <button
        onClick={onChange}
        disabled={disabled || false}
        title={`${disabled && 'Not available yet'}`}
        className={`
          relative
          w-12
          h-7
          rounded-full
          transition-all
          
          ${disabled && "cursor-wait"}

          ${
            value
              ? "bg-[#34C759]"
              : "bg-slate-300"
          }
        `}
      >
        <div
          className={`
            absolute
            top-0.5
            w-6
            h-6
            bg-white
            rounded-full
            shadow-sm
            transition-all
            ${
              value
                ? "translate-x-5"
                : "translate-x-0.5"
            }
          `}
        />
      </button>
    </div>
  );
}

/* ---------- ACTION ---------- */

function ActionRow({ icon, title }) {
  return (
    <button
      className="
      w-full
      flex
      items-center
      justify-between
      px-6
      py-5
      border-b
      border-slate-100
      last:border-none
      hover:bg-slate-50
      transition
    "
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="text-slate-500">
            {icon}
          </div>
        )}

        <span className="text-slate-700 font-medium">
          {title}
        </span>
      </div>

      <ChevronRight
        size={18}
        className="text-slate-400"
      />
    </button>
  );
}