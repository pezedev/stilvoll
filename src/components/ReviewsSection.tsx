import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

import review1 from "@/assets/user-1.png";
import review2 from "@/assets/user-2.png";
import review3 from "@/assets/user-3.png";

const testimonials = [
  { name: "Lukas Müller", photo: review1, rating: 5, text: "A atmosfera é incrível, mas o que realmente impressiona é a reinterpretação dos clássicos. O Schnitzel estava perfeito, embora o tempo de espera tenha sido um pouco longo devido à casa cheia. Valeu cada minuto." },
  { name: "Sabine Fischer", photo: review2, rating: 4, text: "Comida excelente e apresentação impecável. Só não dou 5 estrelas porque achei as porções um pouco pequenas pelo preço, mas a qualidade é inegável. O atendimento foi muito atencioso." },
  { name: "Dieter Schmidt", photo: review3, rating: 5, text: "A melhor experiência em Berlim. O Klaus Volk é um gênio. Recomendo fortemente a harmonização de vinhos, eles realmente sabem o que estão fazendo aqui. Uma noite para recordar." },
];

const StarInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onChange(s)} className="p-0.5">
        <Star className={`w-5 h-5 transition-colors ${s <= value ? "fill-foreground text-foreground" : "text-border hover:text-muted-foreground"}`} />
      </button>
    ))}
  </div>
);

const ReviewsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [list, setList] = useState(testimonials);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) { toast.error(t("rev.error")); return; }
    
    const newReview = {
      name: userName || "Visitante Anônimo",
      photo: "", // Sem foto como solicitado
      rating,
      text: comment
    };

    // Substitui a primeira e rotaciona (ou apenas substitui a primeira)
    // Para animação ficar legal, vamos remover a primeira e adicionar a nova no final, ou vice-versa
    setList(prev => [newReview, prev[0], prev[1]]);
    
    toast.success(t("rev.thanks"));
    setRating(0); setComment(""); setUserName("");
  };

  return (
    <section id="avaliacoes" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="text-xs tracking-[0.5em] uppercase text-muted-foreground mb-4">{t("rev.subtitle")}</p>
          <h2 className="text-3xl md:text-5xl font-extralight tracking-[0.1em] text-foreground">{t("rev.title")}</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <AnimatePresence mode="popLayout">
            {list.slice(0, 3).map((te, i) => (
              <motion.div 
                key={`${te.name}-${te.text.slice(0, 10)}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-8 border border-border hover:border-foreground/20 transition-colors bg-background flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= te.rating ? "fill-foreground text-foreground" : "text-border"}`} />)}
                  </div>
                  <p className="text-sm font-light leading-relaxed text-foreground mb-6">"{te.text}"</p>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  {te.photo ? (
                    <img src={te.photo} alt={te.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" width={40} height={40} />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground border border-border">
                      {te.name.charAt(0)}
                    </div>
                  )}
                  <p className="text-xs tracking-[0.1em] text-muted-foreground">{te.name}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="max-w-lg mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 text-center">{t("rev.leave")}</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center"><StarInput value={rating} onChange={setRating} /></div>
            <input type="text" placeholder={t("rev.yourName")} value={userName} onChange={e => setUserName(e.target.value)}
              className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
            <textarea placeholder={t("rev.placeholder")} value={comment} onChange={e => setComment(e.target.value)} rows={3}
              className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none" />
            <button type="submit" className="w-full py-4 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Send className="w-3 h-3" /> {t("rev.send")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
