import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import SiteFooter from "@/components/SiteFooter";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Stilvoll header (the global one only appears after auth) */}
      <header className="border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-light tracking-[0.25em] text-foreground">STILVOLL</Link>
          <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">Privé</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-md"
        >
          <p className="text-[10px] tracking-[0.6em] uppercase text-muted-foreground mb-8">{t("notfound.kicker")}</p>
          <h1 className="text-7xl md:text-8xl font-extralight tracking-[0.1em] text-foreground mb-6">404</h1>
          <div className="h-px bg-border w-16 mx-auto mb-6" />
          <h2 className="text-xl md:text-2xl font-extralight tracking-[0.05em] text-foreground mb-4">
            {t("notfound.title")}
          </h2>
          <p className="text-sm text-muted-foreground font-light mb-12 leading-relaxed">
            {t("notfound.description")}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center min-h-[44px] px-10 py-3 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity"
          >
            {t("notfound.cta")}
          </Link>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default NotFound;
