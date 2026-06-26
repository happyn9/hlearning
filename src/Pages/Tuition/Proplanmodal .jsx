import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Stamp } from "lucide-react";
import { useNavigate } from "react-router";

const LANG_LABELS = {
  english: { name: "English", flag: "🇬🇧", tagline: "Master English, your way" },
  french:  { name: "Français", flag: "🇫🇷", tagline: "Maîtrisez le français, à votre rythme" },
};

const PLAN_TIERS = {
  standard: { label: "Standard", price: 20, perk: null },
  premium:  { label: "Premium", price: 35, perk: "Most popular" },
};

const COURSE_LABEL_BY_LANG = {
  english: "eng",
  french: "fr",
};

export default function ProPlanModal({ onClose }) {
  const [language, setLanguage] = useState("english");
  const [tier, setTier] = useState("standard");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const plan = PLAN_TIERS[tier];

  const renewDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });

  const handleSubscribe = useCallback(() => {
    if (subscribed) return;
    const courseLabel = COURSE_LABEL_BY_LANG[language];
    setSubscribed(true);
    setTimeout(() => {
      navigate(`/tuition_dashboard/${courseLabel}/hlearning`);
      onClose();
    }, 1800);
  }, [subscribed, language, navigate, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        background: "var(--td-bg)",
        backgroundImage: "radial-gradient(circle at 14% 6%, rgba(255,107,74,0.06), transparent 38%)",
        overflowY: "auto",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Back */}
      <div style={{ padding: "28px 32px 0" }}>
        <button
          onClick={onClose}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: 11,
            background: "var(--td-surface)", border: "1px solid var(--td-border)",
            color: "var(--td-sub)", cursor: "pointer", transition: "all .15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--td-coral-soft)"; e.currentTarget.style.color = "var(--td-coral)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--td-surface)"; e.currentTarget.style.color = "var(--td-sub)"; }}
        >
          <ArrowLeft size={16} />
        </button>
      </div>

      {/* Centered content column */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: 480, margin: "0 auto", padding: "28px 24px 80px" }}
      >
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
          <Stamp size={19} color="var(--td-coral)" />
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 26, fontWeight: 700,
            letterSpacing: "-0.02em", color: "var(--td-text)",
          }}>
            Pro passport
          </span>
        </div>
        <div style={{ fontSize: 13, color: "var(--td-sub)", marginBottom: 18 }}>
          {LANG_LABELS[language].tagline}
        </div>

        {/* Language switch */}
        <div style={{
          display: "inline-flex", padding: 4, marginBottom: 22,
          background: "var(--td-surface)", border: "1px solid var(--td-border)", borderRadius: 13,
        }}>
          {Object.entries(LANG_LABELS).map(([key, l]) => {
            const active = language === key;
            return (
              <button
                key={key}
                onClick={() => setLanguage(key)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 16px", borderRadius: 10, border: "none",
                  background: active ? "var(--td-coral)" : "transparent",
                  color: active ? "#11152a" : "var(--td-sub)",
                  fontSize: 13, fontWeight: 700,
                  cursor: "pointer", transition: "all .18s",
                }}
              >
                <span style={{ fontSize: 14 }}>{l.flag}</span>
                {l.name}
              </button>
            );
          })}
        </div>

        {/* Plan tier toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
          <BillingCard
            active={tier === "standard"}
            onClick={() => setTier("standard")}
            label={PLAN_TIERS.standard.label}
            price={`$${PLAN_TIERS.standard.price.toFixed(2)}/month + tax`}
          />
          <BillingCard
            active={tier === "premium"}
            onClick={() => setTier("premium")}
            label={PLAN_TIERS.premium.label}
            price={`$${PLAN_TIERS.premium.price.toFixed(2)}/month + tax`}
            badge={PLAN_TIERS.premium.perk}
          />
        </div>

        {/* Order details */}
        <div style={{
          background: "var(--td-surface)",
          border: "1px dashed var(--td-border-med)",
          borderRadius: 14, padding: 18, marginBottom: 14,
        }}>
          <div style={{
            fontFamily: "var(--font-stamp)",
            fontSize: 10, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.14em", color: "var(--td-muted)", marginBottom: 14,
          }}>
            Order details
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, color: "var(--td-text)" }}>{plan.label} plan</div>
              <div style={{ fontSize: 12, color: "var(--td-muted)", marginTop: 2 }}>Billed monthly</div>
            </div>
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--td-text)" }}
            >
              ${plan.price}
            </motion.div>
          </div>

          <div style={{ height: 1, background: "var(--td-border)", margin: "12px 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: "var(--td-sub)" }}>Subtotal</div>
            <motion.div key={`sub-${tier}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--td-text)" }}>
              ${plan.price}
            </motion.div>
          </div>

          <div style={{ height: 1, background: "var(--td-border)", margin: "12px 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--td-text)" }}>Total due today</div>
            <motion.div key={`total-${tier}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--td-coral)" }}>
              ${plan.price}
            </motion.div>
          </div>
        </div>

        {/* Auto-renew notice */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          background: "var(--td-surface)", border: "1px solid var(--td-border)",
          borderRadius: 12, padding: "13px 15px", marginBottom: 18,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: "50%",
            border: "1.5px solid var(--td-muted)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginTop: 1,
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "var(--td-muted)", fontStyle: "italic" }}>i</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--td-muted)", lineHeight: 1.55 }}>
            Your subscription will auto renew on {renewDate}. You will be charged ${plan.price}.00/month + tax.
          </div>
        </div>

        {/* CTA */}
        <motion.button
          onClick={handleSubscribe}
          whileTap={{ scale: subscribed ? 1 : 0.98 }}
          disabled={subscribed}
          style={{
            width: "100%", padding: "15px 0",
            borderRadius: 14, border: "none",
            background: subscribed ? "var(--td-teal)" : "var(--td-coral)",
            color: "#11152a", fontSize: 15, fontWeight: 700,
            letterSpacing: "-0.01em", cursor: subscribed ? "default" : "pointer",
            transition: "background .3s, opacity .15s",
            boxShadow: subscribed ? "0 8px 28px rgba(69,194,166,0.3)" : "var(--td-shadow-coral)",
          }}
          onMouseEnter={(e) => { if (!subscribed) e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {subscribed ? "✓ Stamped & subscribed" : "Subscribe to Pro"}
        </motion.button>

        {/* Security note */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 5, marginTop: 12,
          fontFamily: "var(--font-stamp)",
          fontSize: 10.5, color: "var(--td-muted)", letterSpacing: "0.02em",
        }}>
          <Lock size={10} />
          Secured with 256-bit encryption
        </div>
      </motion.div>
    </motion.div>
  );
}

function BillingCard({ active, onClick, label, price, badge }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 14, padding: "14px 16px",
        cursor: "pointer",
        border: `1.5px ${active ? "solid" : "dashed"} ${active ? "var(--td-coral)" : "var(--td-border-med)"}`,
        background: active ? "var(--td-coral-soft)" : "var(--td-surface)",
        transition: "all .18s",
        position: "relative", overflow: "hidden",
      }}
    >
      {badge && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "var(--td-teal-soft)",
          border: "1px solid rgba(69,194,166,0.35)",
          color: "var(--td-teal)",
          fontFamily: "var(--font-stamp)",
          fontSize: 9, fontWeight: 600,
          letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "3px 7px", borderRadius: 6,
        }}>
          {badge}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{
          width: 17, height: 17, borderRadius: "50%",
          border: `1.5px solid ${active ? "var(--td-coral)" : "var(--td-muted)"}`,
          background: active ? "var(--td-coral)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .15s", flexShrink: 0,
        }}>
          {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#11152a" }} />}
        </div>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--td-text)", letterSpacing: "-0.01em" }}>
          {label}
        </span>
      </div>

      <div style={{ fontSize: 12, color: active ? "var(--td-sub)" : "var(--td-muted)", marginTop: 2 }}>
        {price}
      </div>
    </div>
  );
}