import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import type { Lang } from "@/i18n/translations";

interface SiteHeaderProps {
  onDelivery: () => void;
}

const langOptions: { code: Lang; label: string; flag: string }[] = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

const SiteHeader = ({ onDelivery }: SiteHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { scrollY } = useScroll();
  const { lang, setLang, t } = useLanguage();
  const { isLoggedIn } = useAuth();

  const headerOpacity = useTransform(scrollY, [200, 350], [0, 1]);
  const headerY = useTransform(scrollY, [200, 350], [-20, 0]);
  const logoOpacity = useTransform(scrollY, [280, 350], [0, 1]);
  const navOpacity = useTransform(scrollY, [300, 400], [0, 1]);

  const navItems = [
    { label: t("nav.menu"), id: "cardapio" },
    { label: t("nav.drinks"), id: "bebidas" },
    { label: t("nav.chefs"), id: "chefs" },
    { label: t("nav.reservation"), id: "reserva" },
    { label: t("nav.reviews"), id: "avaliacoes" },
    { label: t("nav.units"), id: "contato" },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const currentLang = langOptions.find(l => l.code === lang)!;

  return (
    <>
      <motion.header
        style={{ opacity: headerOpacity, y: headerY }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.button
            style={{ opacity: logoOpacity }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-lg font-light tracking-[0.25em] text-foreground"
            aria-label="Voltar para o topo"
          >
            STILVOLL
          </motion.button>

          <motion.nav style={{ opacity: navOpacity }} className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={onDelivery}
              className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {t("nav.delivery")}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="inline-flex items-center justify-center gap-1.5 min-h-11 min-w-11 px-2 text-xs tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Alterar idioma"
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{currentLang.flag}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-full mt-2 bg-background border border-border rounded-lg shadow-xl py-1 min-w-[140px] z-50"
                  >
                    {langOptions.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => { setLang(opt.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2 px-4 min-h-11 text-xs tracking-wider transition-colors ${lang === opt.code ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                      >
                        <span>{opt.flag}</span>
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-1.5 min-h-11 min-w-11 px-2 text-xs tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors"
                title={t("nav.account")}
                aria-label={t("nav.account")}
              >
                <User className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
          </motion.nav>

          <motion.div style={{ opacity: navOpacity }} className="flex md:hidden items-center gap-2">
            <button 
              onClick={() => setMenuOpen(true)} 
              className="inline-flex items-center justify-center h-11 w-11"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* Full-screen mobile menu (iOS style) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-background flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-border/50">
              <span className="text-lg font-light tracking-[0.25em] text-foreground" aria-hidden="true">STILVOLL</span>
              <button 
                onClick={() => setMenuOpen(false)} 
                className="inline-flex items-center justify-center h-11 w-11"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 gap-6">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => scrollTo(item.id)}
                  className="text-2xl font-extralight tracking-[0.15em] text-foreground text-left"
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                onClick={() => { onDelivery(); setMenuOpen(false); }}
                className="text-2xl font-extralight tracking-[0.15em] text-foreground text-left"
              >
                {t("nav.delivery")}
              </motion.button>
              {isLoggedIn && (
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-extralight tracking-[0.15em] text-foreground text-left inline-flex items-center gap-3"
                >
                  <User className="w-5 h-5" />
                  {t("nav.account")}
                </Link>
              )}
            </div>
            <div className="px-8 pb-10">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t("nav.units")}</p>
              <div className="flex gap-3">
                {langOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => setLang(opt.code)}
                    className={`px-3 py-1.5 text-sm border rounded-full transition-all ${lang === opt.code ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground"}`}
                  >
                    {opt.flag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SiteHeader;
