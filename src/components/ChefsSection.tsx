import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import chefKlaus from "@/assets/chef-klaus.jpg";
import chefElara from "@/assets/chef-elara.jpg";
import chefHans from "@/assets/chef-hans.jpg";
import chefSofia from "@/assets/chef-sofia.jpg";

const chefs = [
  { name: "Klaus Volk", title: "Chef Executivo", image: chefKlaus, description: "Formado na Floresta Negra, Klaus une a tradição rigorosa com a precisão contemporânea. Especialista em técnicas de caça e fermentação milenar, suas criações são reconhecidas por três estrelas Michelin." },
  { name: "Elara Fischer", title: "Chef Pâtissière & Inovação", image: chefElara, description: "Inovadora da gastronomia molecular em Berlim, Elara desconstrói os clássicos alemães para recriá-los em texturas surpreendentes. Premiada pelo Gault & Millau como revelação do ano." },
  { name: "Hans Müller", title: "Sous Chef & Tradição", image: chefHans, description: "Com raízes na Baviera, Hans domina as receitas ancestrais da cozinha germânica com maestria absoluta. Seu comprometimento com ingredientes locais e técnicas centenárias é incomparável." },
  { name: "Sofia Wagner", title: "Chef de Garde Manger", image: chefSofia, description: "Especialista em entradas frias e charcutaria artesanal, Sofia transforma produtos regionais em obras de arte comestíveis. Sua precisão e criatividade definem o padrão do Stilvoll." },
];

const ChefCard = ({ chef, index }: { chef: typeof chefs[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: index * 0.15 }} className="flex flex-col items-center text-center">
      <div className="w-56 h-72 md:w-64 md:h-80 overflow-hidden mb-8 group">
        <img src={chef.image} alt={chef.name} loading="lazy" width={640} height={800} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]" />
      </div>
      <h3 className="text-xl font-light tracking-[0.15em] text-foreground mb-1">{chef.name}</h3>
      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">{chef.title}</p>
      <p className="text-sm font-light leading-relaxed text-muted-foreground max-w-xs">{chef.description}</p>
    </motion.div>
  );
};

const ChefsSection = () => {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section id="chefs" className="py-32 px-6 bg-elevated">
      <div className="max-w-6xl mx-auto">
        <motion.div ref={titleRef} initial={{ opacity: 0, y: 40 }} animate={titleInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-20">
          <p className="text-xs tracking-[0.5em] uppercase text-muted-foreground mb-4">{t("chefs.subtitle")}</p>
          <h2 className="text-3xl md:text-5xl font-extralight tracking-[0.1em] text-foreground">{t("chefs.title")}</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 justify-items-center">
          {chefs.map((chef, i) => <ChefCard key={chef.name} chef={chef} index={i} />)}
        </div>
      </div>
    </section>
  );
};

export default ChefsSection;
