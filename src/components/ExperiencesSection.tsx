import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

import mitteFacade from "@/assets/unit-mitte-facade.jpg";
import mitteInterior from "@/assets/unit-mitte-interior.jpg";
import charlottenburgFacade from "@/assets/unit-charlottenburg-facade.jpg";
import charlottenburgInterior from "@/assets/unit-charlottenburg-interior.jpg";
import friedrichshainFacade from "@/assets/stilvoll-friedrichshain-1.jpg";
import friedrichshainInterior from "@/assets/stilvoll-friedrichshain-2.jpg";

export const units = [
  {
    id: "mitte",
    name: "Stilvoll Mitte",
    subtitle: "O Epítome do Luxo",
    description: "A unidade mais exclusiva da Alemanha. Cada detalhe foi concebido para transcender a experiência gastronômica convencional — do mármore Carrara que reveste o salão à iluminação milimetricamente calibrada. Aqui, o minimalismo encontra a perfeição absoluta.",
    images: [mitteFacade, mitteInterior],
    captions: ["Fachada — Unter den Linden", "Interior — Salão Principal"],
  },
  {
    id: "charlottenburg",
    name: "Stilvoll Charlottenburg",
    subtitle: "A Experiência Histórica",
    description: "No coração cultural de Berlim, esta unidade celebra a herança arquitetônica da cidade. Lustres de cristal, painéis de madeira centenária e tetos ornamentados compõem um ambiente onde a sofisticação clássica encontra a alta gastronomia contemporânea.",
    images: [charlottenburgFacade, charlottenburgInterior],
    captions: ["Fachada — Kurfürstendamm", "Interior — Salão Histórico"],
  },
  {
    id: "friedrichshain",
    name: "Stilvoll Friedrichshain",
    subtitle: "A Experiência ao Ar Livre",
    description: "Um refúgio urbano onde a natureza se integra ao design. O jardim de inverno luxuoso, banhado por luz natural através de tetos de vidro, cria uma atmosfera etérea. Árvores centenárias e vegetação exuberante envolvem cada mesa, oferecendo uma experiência sensorial única.",
    images: [friedrichshainFacade, friedrichshainInterior],
    captions: ["Pátio — Jardim Interno", "Interior — Jardim de Inverno"],
  },
];

interface ExperiencesSectionProps {
  onReserveUnit: (unitId: string) => void;
}

const ExperiencesSection = ({ onReserveUnit }: ExperiencesSectionProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <>
      <section id="experiencias" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-20">
            <p className="text-xs tracking-[0.5em] uppercase text-muted-foreground mb-4">{t("exp.subtitle")}</p>
            <h2 className="text-3xl md:text-5xl font-extralight tracking-[0.1em] text-foreground">{t("exp.title")}</h2>
          </motion.div>

          <div className="space-y-32">
            {units.map((unit, i) => (
              <motion.div key={unit.id} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, delay: 0.1 }}>
                <div className="mb-8">
                  <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-2">{unit.subtitle}</p>
                  <h3 className="text-2xl md:text-3xl font-extralight tracking-[0.08em] text-foreground">{unit.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl mb-10 font-light">{unit.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {unit.images.map((img, j) => (
                    <button key={j} onClick={() => setLightbox(img)} className="relative overflow-hidden group cursor-pointer">
                      <img src={img} alt={unit.captions[j]} className="w-full h-48 md:h-64 object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" width={896} height={512} />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                      <p className="absolute bottom-3 left-3 text-xs text-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{unit.captions[j]}</p>
                    </button>
                  ))}
                </div>
                <button onClick={() => onReserveUnit(unit.id)} className="px-8 py-3 border border-border text-xs tracking-[0.3em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all duration-300">
                  {t("exp.reserve")}
                </button>
                {i < units.length - 1 && <div className="mt-20 border-t border-border" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-sm p-4" onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 p-2 text-background hover:opacity-70 transition-opacity"><X className="w-6 h-6" /></button>
            <motion.img initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} src={lightbox} alt="Ampliação" className="max-w-full max-h-[85vh] object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExperiencesSection;
