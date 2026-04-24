import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Wine, Droplets, GlassWater, CupSoda, Beer } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

import drinkPilsner from "@/assets/drink-pilsner.jpg";
import drinkWeissbier from "@/assets/drink-weissbier.jpg";
import drinkCocktail from "@/assets/drink-cocktail.jpg";
import drinkWine from "@/assets/drink-wine.jpg";

export interface DrinkItem {
  name: string;
  desc: string;
  price: string;
  priceNum: number;
  image: string;
}

export const drinkCategories = [
  {
    name: "Vinhos", nameKey: "wines",
    icon: Wine,
    items: [
      { name: "Château Margaux 2015", desc: "Bordeaux, França — Corpo intenso, taninos sedosos", price: "€320", priceNum: 320, image: drinkWine },
      { name: "Riesling Spätlese Prüm", desc: "Mosel, Alemanha — Doçura equilibrada, acidez mineral", price: "€85", priceNum: 85, image: drinkWine },
      { name: "Barolo Giacomo Conterno", desc: "Piemonte, Itália — Elegância terrosa, notas de rosa", price: "€240", priceNum: 240, image: drinkWine },
      { name: "Dom Pérignon 2012", desc: "Champagne, França — Efervescência precisa, complexidade", price: "€450", priceNum: 450, image: drinkWine },
      { name: "Pinot Noir Spätburgunder", desc: "Baden, Alemanha — Frutas vermelhas, estrutura elegante", price: "€110", priceNum: 110, image: drinkWine },
      { name: "Gewürztraminer Alsace", desc: "Alsácia, França — Aromático, lychee e pétalas de rosa", price: "€95", priceNum: 95, image: drinkWine },
    ],
  },
  {
    name: "Cervejas Artesanais", nameKey: "beers",
    icon: Beer,
    items: [
      { name: "Pilsner Urquell Premium", desc: "Estilo tcheco clássico, lúpulo Saaz, finalização limpa", price: "€14", priceNum: 14, image: drinkPilsner },
      { name: "Weihenstephaner Hefeweissbier", desc: "Trigo bávaro, notas de banana e cravo, corpo sedoso", price: "€16", priceNum: 16, image: drinkWeissbier },
      { name: "Augustiner Helles", desc: "Munique — Malte delicado, carbonatação suave", price: "€14", priceNum: 14, image: drinkPilsner },
      { name: "Schneider Weisse Aventinus", desc: "Weizenbock escura, caramelo, frutas secas", price: "€18", priceNum: 18, image: drinkWeissbier },
    ],
  },
  {
    name: "Cocktails", nameKey: "cocktails",
    icon: GlassWater,
    items: [
      { name: "Berliner Negroni", desc: "Gin alemão, Campari, vermute artesanal de Berlim", price: "€22", priceNum: 22, image: drinkCocktail },
      { name: "Schwarzwald Sour", desc: "Kirsch da Floresta Negra, limão, clara de ovo, bitter", price: "€24", priceNum: 24, image: drinkCocktail },
      { name: "Kölsch Spritz", desc: "Redução de Kölsch, Aperol, prosecco, hortelã fresca", price: "€20", priceNum: 20, image: drinkCocktail },
      { name: "Apfelstrudel Old Fashioned", desc: "Bourbon, xarope de maçã canela, Angostura", price: "€26", priceNum: 26, image: drinkCocktail },
    ],
  },
  {
    name: "Águas Premium", nameKey: "waters",
    icon: Droplets,
    items: [
      { name: "Acqua Panna", desc: "Toscana — Mineral suave, pura elegância", price: "€12", priceNum: 12, image: drinkWine },
      { name: "San Pellegrino", desc: "Alpes Italianos — Gaseificação natural e fina", price: "€12", priceNum: 12, image: drinkWine },
      { name: "Voss Still", desc: "Noruega — Ultra-pureza artesiana", price: "€14", priceNum: 14, image: drinkWine },
    ],
  },
  {
    name: "Sucos & Refrigerantes", nameKey: "juices",
    icon: CupSoda,
    items: [
      { name: "Maçã Verde & Gengibre", desc: "Prensado a frio, orgânico", price: "€16", priceNum: 16, image: drinkWine },
      { name: "Cenoura & Laranja Sanguínea", desc: "Vitaminas naturais, sem adição de açúcar", price: "€16", priceNum: 16, image: drinkWine },
      { name: "Fritz-Kola", desc: "Hamburgo — Cola artesanal alemã", price: "€8", priceNum: 8, image: drinkWine },
      { name: "Bionade Erva-cidreira", desc: "Fermentação natural, refrescância orgânica", price: "€8", priceNum: 8, image: drinkWine },
    ],
  },
];

const DrinksSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section id="bebidas" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase text-muted-foreground mb-4">{t("drinks.subtitle")}</p>
          <h2 className="text-3xl md:text-5xl font-extralight tracking-[0.1em] text-foreground">{t("drinks.title")}</h2>
        </motion.div>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {drinkCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button key={cat.name} onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300 border-b-2 ${
                  activeTab === i ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}>
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {drinkCategories[activeTab].items.map((item) => (
            <div key={item.name} className="flex items-center justify-between py-5 border-b border-border group">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-sm flex-shrink-0" loading="lazy" width={40} height={40} />
                <div>
                  <h4 className="text-sm font-medium tracking-[0.05em] text-foreground group-hover:text-muted-foreground transition-colors">{item.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1 font-light">{item.desc}</p>
                </div>
              </div>
              <span className="text-sm font-light text-foreground ml-6 whitespace-nowrap">{item.price}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DrinksSection;
