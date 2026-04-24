import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility, Type, Contrast, Eye, X, FileText, Link2, AlignLeft } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [textSize, setTextSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [lineHeight, setLineHeight] = useState(false);
  const [linkHighlight, setLinkHighlight] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const html = document.documentElement;
    
    // Manage Text Size
    html.classList.remove("a11y-text-large", "a11y-text-xlarge");
    if (textSize === "large") html.classList.add("a11y-text-large");
    if (textSize === "xlarge") html.classList.add("a11y-text-xlarge");

    // Manage Fonts & Layout
    html.classList.toggle("a11y-dyslexic", dyslexicFont);
    html.classList.toggle("a11y-line-height", lineHeight);
    html.classList.toggle("a11y-link-highlight", linkHighlight);

    // Manage Visual Filters (Combined to avoid overriding)
    let filters = [];
    if (grayscale) filters.push("grayscale(100%)");
    if (highContrast) filters.push("contrast(125%) saturate(120%)");
    
    if (filters.length > 0) {
      html.style.filter = filters.join(" ");
    } else {
      html.style.filter = "";
    }

  }, [textSize, highContrast, grayscale, dyslexicFont, lineHeight, linkHighlight]);

  const toggleTextSize = () => {
    setTextSize(prev => prev === "normal" ? "large" : prev === "large" ? "xlarge" : "normal");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-background border border-border shadow-2xl rounded-sm p-4 mb-4 w-72 origin-bottom-right overflow-y-auto max-h-[70vh]"
          >
            <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
              <span className="text-xs tracking-[0.2em] uppercase font-medium text-foreground">Acessibilidade</span>
              <button onClick={() => setIsOpen(false)} aria-label="Fechar menu de acessibilidade" className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={toggleTextSize}
                className="w-full flex items-center justify-between p-3 border border-border rounded-sm hover:border-foreground/30 transition-colors group"
                aria-label="Aumentar texto"
                aria-live="polite"
              >
                <div className="flex items-center gap-3">
                  <Type className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-sm font-light text-foreground">Tamanho do Texto</span>
                </div>
                <span className="text-xs text-muted-foreground tracking-wider uppercase">
                  {textSize === "normal" ? "Padrão" : textSize === "large" ? "Maior" : "Máximo"}
                </span>
              </button>

              <button
                onClick={() => setHighContrast(!highContrast)}
                aria-pressed={highContrast}
                className={`w-full flex items-center justify-between p-3 border rounded-sm transition-colors group ${highContrast ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30 text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  <Contrast className={`w-4 h-4 ${highContrast ? "text-background" : "text-muted-foreground group-hover:text-foreground"} transition-colors`} />
                  <span className="text-sm font-light">Alto Contraste</span>
                </div>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${highContrast ? "bg-background" : "bg-muted-foreground/30"}`}>
                  <div className={`w-3 h-3 rounded-full bg-foreground transition-transform ${highContrast ? "translate-x-4 bg-foreground" : "translate-x-0 bg-background"}`} />
                </div>
              </button>

              <button
                onClick={() => setGrayscale(!grayscale)}
                aria-pressed={grayscale}
                className={`w-full flex items-center justify-between p-3 border rounded-sm transition-colors group ${grayscale ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30 text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  <Eye className={`w-4 h-4 ${grayscale ? "text-background" : "text-muted-foreground group-hover:text-foreground"} transition-colors`} />
                  <span className="text-sm font-light">Modo Monocromático</span>
                </div>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${grayscale ? "bg-background" : "bg-muted-foreground/30"}`}>
                  <div className={`w-3 h-3 rounded-full bg-foreground transition-transform ${grayscale ? "translate-x-4 bg-foreground" : "translate-x-0 bg-background"}`} />
                </div>
              </button>

              <button
                onClick={() => setDyslexicFont(!dyslexicFont)}
                aria-pressed={dyslexicFont}
                className={`w-full flex items-center justify-between p-3 border rounded-sm transition-colors group ${dyslexicFont ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30 text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-4 h-4 ${dyslexicFont ? "text-background" : "text-muted-foreground group-hover:text-foreground"} transition-colors`} />
                  <span className="text-sm font-light">Fonte Disléxica</span>
                </div>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${dyslexicFont ? "bg-background" : "bg-muted-foreground/30"}`}>
                  <div className={`w-3 h-3 rounded-full bg-foreground transition-transform ${dyslexicFont ? "translate-x-4 bg-foreground" : "translate-x-0 bg-background"}`} />
                </div>
              </button>

              <button
                onClick={() => setLineHeight(!lineHeight)}
                aria-pressed={lineHeight}
                className={`w-full flex items-center justify-between p-3 border rounded-sm transition-colors group ${lineHeight ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30 text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  <AlignLeft className={`w-4 h-4 ${lineHeight ? "text-background" : "text-muted-foreground group-hover:text-foreground"} transition-colors`} />
                  <span className="text-sm font-light">Espaçamento de Linha</span>
                </div>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${lineHeight ? "bg-background" : "bg-muted-foreground/30"}`}>
                  <div className={`w-3 h-3 rounded-full bg-foreground transition-transform ${lineHeight ? "translate-x-4 bg-foreground" : "translate-x-0 bg-background"}`} />
                </div>
              </button>

              <button
                onClick={() => setLinkHighlight(!linkHighlight)}
                aria-pressed={linkHighlight}
                className={`w-full flex items-center justify-between p-3 border rounded-sm transition-colors group ${linkHighlight ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30 text-foreground"}`}
              >
                <div className="flex items-center gap-3">
                  <Link2 className={`w-4 h-4 ${linkHighlight ? "text-background" : "text-muted-foreground group-hover:text-foreground"} transition-colors`} />
                  <span className="text-sm font-light">Destacar Links</span>
                </div>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${linkHighlight ? "bg-background" : "bg-muted-foreground/30"}`}>
                  <div className={`w-3 h-3 rounded-full bg-foreground transition-transform ${linkHighlight ? "translate-x-4 bg-foreground" : "translate-x-0 bg-background"}`} />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menu de acessibilidade"
        aria-expanded={isOpen}
        className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Accessibility className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
};

export default AccessibilityMenu;
