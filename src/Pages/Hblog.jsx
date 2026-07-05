import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Search,
  Code2,
  Briefcase,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "../Components/Home/Navbar";
import Footer from "../Components/Footer";

const sf = { fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif" };

const COLORS = {
  ink: "#1D1D1F",
  gray: "#86868B",
  hairline: "rgba(0,0,0,0.08)",
  surface: "rgba(255,255,255,0.82)",
  surfaceSolid: "#FFFFFF",
  blue: "#0071E3",
  blueHover: "#0077ED",
  blueTint: "rgba(0,113,227,0.08)",
  paper: "#FAFAFA",
};

/* Catégories : id + icône + couleur uniquement, le label vient de i18n */
const CATEGORY_META = [
  { id: "all", icon: Sparkles, color: COLORS.blue },
  { id: "tutorials", icon: Code2, color: "#0D9488" },
  { id: "career", icon: Briefcase, color: "#DB2777" },
  { id: "community", icon: Users, color: "#B45309" },
];

/* Données non-textuelles seulement — titre/excerpt viennent de i18n via l'id */
const ARTICLES_META = [
  { id: 1, category: "tutorials", author: "Amina L.", date: "2 juil. 2026", readTime: "6 min", featured: true, accent: "#0D9488" },
  { id: 2, category: "career", author: "Marc R.", date: "28 juin 2026", readTime: "8 min", accent: "#DB2777" },
  { id: 3, category: "tutorials", author: "Équipe hlearning", date: "24 juin 2026", readTime: "5 min", accent: "#0D9488" },
  { id: 4, category: "community", author: "Sofia K.", date: "20 juin 2026", readTime: "4 min", accent: "#B45309" },
  { id: 5, category: "career", author: "Marc R.", date: "15 juin 2026", readTime: "7 min", accent: "#DB2777" },
  { id: 6, category: "tutorials", author: "Amina L.", date: "10 juin 2026", readTime: "6 min", accent: "#0D9488" },
];

function CategoryPill({ cat, label, active, onClick }) {
  const Icon = cat.icon;
  return (
    <button
      onClick={onClick}
      className="relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors"
      style={{ ...sf, color: active ? "#FFFFFF" : COLORS.ink }}
    >
      {active && (
        <motion.span
          layoutId="hblogCategoryPill"
          className="absolute inset-0 rounded-full -z-10"
          style={{ background: cat.color }}
          transition={{ type: "spring", stiffness: 500, damping: 36 }}
        />
      )}
      <Icon size={13} />
      {label}
    </button>
  );
}

function ArticleCard({ article, index, t }) {
  const cat = CATEGORY_META.find((c) => c.id === article.category);
  const catLabel = t(`blog.categories.${article.category}`);
  const title = t(`blog.articles.${article.id}.title`);
  const excerpt = t(`blog.articles.${article.id}.excerpt`);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer rounded-[22px] overflow-hidden flex flex-col"
      style={{
        background: COLORS.surfaceSolid,
        border: `1px solid ${COLORS.hairline}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 20px 40px -16px rgba(0,0,0,0.16)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)")}
    >
      <div
        className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${article.accent}18 0%, ${article.accent}06 100%)` }}
      >
        <Code2 size={28} style={{ color: article.accent, opacity: 0.5 }} />
        <span
          className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
          style={{ ...sf, background: COLORS.surfaceSolid, color: article.accent }}
        >
          <cat.icon size={11} />
          {catLabel}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-[15px] font-semibold leading-snug mb-2 group-hover:opacity-70 transition-opacity"
          style={{ ...sf, color: COLORS.ink }}
        >
          {title}
        </h3>
        <p className="text-[13px] leading-relaxed mb-4 flex-1" style={{ ...sf, color: COLORS.gray }}>
          {excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: COLORS.hairline }}>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
              style={{ background: COLORS.blueTint, color: COLORS.blue }}
            >
              {article.author.charAt(0)}
            </div>
            <span className="text-[11.5px]" style={{ ...sf, color: COLORS.gray }}>
              {article.author}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11.5px]" style={{ ...sf, color: COLORS.gray }}>
            <Clock size={11} />
            {article.readTime}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function FeaturedArticle({ article, t }) {
  const cat = CATEGORY_META.find((c) => c.id === article.category);
  const catLabel = t(`blog.categories.${article.category}`);
  const title = t(`blog.articles.${article.id}.title`);
  const excerpt = t(`blog.articles.${article.id}.excerpt`);
  const featuredBadge = t("blog.featuredBadge");
  const readTimeSuffix = t("blog.readTimeSuffix");

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer relative rounded-[28px] overflow-hidden mb-10"
      style={{
        background: `linear-gradient(135deg, ${article.accent}14 0%, ${COLORS.surfaceSolid} 55%)`,
        border: `1px solid ${COLORS.hairline}`,
        boxShadow: "0 30px 60px -24px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <span
            className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full text-[11.5px] font-medium mb-5"
            style={{ ...sf, background: article.accent, color: "#FFFFFF" }}
          >
            <cat.icon size={12} />
            {catLabel} · {featuredBadge}
          </span>
          <h2
            className="text-[24px] sm:text-[30px] font-semibold leading-[1.15] tracking-[-0.01em] mb-4"
            style={{ ...sf, color: COLORS.ink }}
          >
            {title}
          </h2>
          <p className="text-[14px] leading-relaxed mb-6 max-w-md" style={{ ...sf, color: COLORS.gray }}>
            {excerpt}
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold"
              style={{ background: COLORS.blueTint, color: COLORS.blue }}
            >
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="text-[12.5px] font-medium" style={{ ...sf, color: COLORS.ink }}>
                {article.author}
              </p>
              <p className="text-[11.5px]" style={{ ...sf, color: COLORS.gray }}>
                {article.date} · {article.readTime} {readTimeSuffix}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center relative p-10" style={{ background: `${article.accent}0A` }}>
          <div
            className="w-full max-w-[280px] rounded-2xl overflow-hidden border"
            style={{ borderColor: COLORS.hairline, background: "#12141C" }}
          >
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
            </div>
            <div className="p-4 space-y-2">
              <div className="h-2.5 w-3/4 rounded bg-white/15" />
              <div className="h-2.5 w-1/2 rounded bg-white/10 ml-3" />
              <div className="h-2.5 w-2/3 rounded bg-white/10 ml-3" />
              <div className="h-2.5 w-3/5 rounded bg-white/15" />
            </div>
          </div>
          <ArrowUpRight
            size={22}
            className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: article.accent }}
          />
        </div>
      </div>
    </motion.article>
  );
}

export default function Hblog() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [usermodal, setUsermodal] = useState(false);

  const featured = ARTICLES_META.find((a) => a.featured);
  const rest = ARTICLES_META.filter((a) => !a.featured);

  const filtered = useMemo(() => {
    return rest.filter((a) => {
      const matchesCategory = activeCategory === "all" || a.category === activeCategory;
      const title = t(`blog.articles.${a.id}.title`).toLowerCase();
      const excerpt = t(`blog.articles.${a.id}.excerpt`).toLowerCase();
      const matchesQuery = !query || title.includes(query.toLowerCase()) || excerpt.includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [rest, activeCategory, query, t]);

  return (
    <main className="relative" style={{ background: COLORS.paper }}>
      <Navbar OnNav={() => navigate("/auth")} onModal={() => setUsermodal((v) => !v)} />

      <section className="max-w-6xl mx-auto px-6 pt-14 pb-6">
        <div className="mb-10">
          <span className="text-[12px] tracking-tight block mb-3" style={{ ...sf, color: COLORS.gray }}>
            {t("blog.tag")}
          </span>
          <h1
            className="text-4xl sm:text-5xl font-semibold tracking-[-0.02em] leading-[1.08] mb-4"
            style={{ ...sf, color: COLORS.ink }}
          >
            {t("blog.title")}
          </h1>
          <p className="text-[15px] max-w-md" style={{ ...sf, color: COLORS.gray }}>
            {t("blog.subtitle")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <div
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full w-full sm:w-72 shrink-0"
            style={{ background: "#F5F5F7" }}
          >
            <Search size={15} style={{ color: COLORS.gray }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("blog.searchPlaceholder")}
              className="flex-1 bg-transparent outline-none text-[13.5px]"
              style={{ ...sf, color: COLORS.ink }}
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
            {CATEGORY_META.map((cat) => (
              <CategoryPill
                key={cat.id}
                cat={cat}
                label={t(`blog.categories.${cat.id}`)}
                active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
              />
            ))}
          </div>
        </div>

        {activeCategory === "all" && !query && featured && <FeaturedArticle article={featured} t={t} />}

        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeCategory + query}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10"
            >
              {filtered.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} t={t} />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "#F5F5F7" }}>
                <Search size={18} style={{ color: COLORS.gray }} />
              </div>
              <p className="text-[15px] font-medium mb-1" style={{ ...sf, color: COLORS.ink }}>
                {t("blog.noResults.title")}
              </p>
              <p className="text-[13px]" style={{ ...sf, color: COLORS.gray }}>
                {t("blog.noResults.hint")}
              </p>
            </div>
          )}
        </AnimatePresence>

        <div
          className="rounded-[24px] p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16"
          style={{ background: COLORS.ink }}
        >
          <div>
            <h3 className="text-[20px] font-semibold mb-1.5" style={{ ...sf, color: "#FFFFFF" }}>
              {t("blog.newsletter.title")}
            </h3>
            <p className="text-[13.5px]" style={{ ...sf, color: "rgba(255,255,255,0.6)" }}>
              {t("blog.newsletter.subtitle")}
            </p>
          </div>
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium shrink-0 transition hover:opacity-90"
            style={{ ...sf, background: "#FFFFFF", color: COLORS.ink }}
          >
            {t("blog.newsletter.cta")} <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <Footer showfaq={false} />
    </main>
  );
}