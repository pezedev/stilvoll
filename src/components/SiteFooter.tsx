import { useLanguage } from "@/i18n/LanguageContext";

const SiteFooter = () => {
  const { t } = useLanguage();
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="text-sm font-light tracking-[0.25em] text-foreground mb-2">STILVOLL</p>
            <p className="text-xs text-muted-foreground font-light">Unter den Linden, 42 — Berlim, Alemanha</p>
            <p className="text-xs text-muted-foreground font-light mt-1">{t("footer.units")}</p>
          </div>
          <div className="text-center md:text-right space-y-1">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{t("footer.hours")}</p>
            <p className="text-xs text-foreground font-light">{t("footer.weekday")}</p>
            <p className="text-xs text-foreground font-light">{t("footer.weekend")}</p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <a href="tel:+493012345678" className="text-xs text-muted-foreground hover:text-foreground transition-colors">+49 30 1234 5678</a>
            <a href="mailto:reservas@stilvoll.de" className="text-xs text-muted-foreground hover:text-foreground transition-colors">reservas@stilvoll.de</a>
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
