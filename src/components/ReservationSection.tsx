import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/i18n/LanguageContext";
import { reservationStore } from "@/lib/userStore";

import tableJanela from "@/assets/table-janela.jpg";
import tableJardim from "@/assets/table-jardim.jpg";
import tablePrivativo from "@/assets/table-privativo.jpg";
import tableBalcao from "@/assets/table-balcao.jpg";
import tableSalao from "@/assets/table-salao.jpg";

import mitteFacade from "@/assets/unit-mitte-facade.jpg";
import charlottenburgFacade from "@/assets/unit-charlottenburg-facade.jpg";
import friedrichshainFacade from "@/assets/stilvoll-friedrichshain-1.jpg";

const unitOptions = [
  { id: "mitte", label: "Stilvoll Mitte", desc: "O Epítome do Luxo", image: mitteFacade },
  { id: "charlottenburg", label: "Stilvoll Charlottenburg", desc: "Experiência Histórica", image: charlottenburgFacade },
  { id: "friedrichshain", label: "Stilvoll Friedrichshain", desc: "Ao Ar Livre", image: friedrichshainFacade },
];

const tables = [
  { id: "janela", label: "Janela", desc: "Vista panorâmica", image: tableJanela },
  { id: "jardim", label: "Jardim", desc: "Ao ar livre", image: tableJardim },
  { id: "privativo", label: "Privativo", desc: "Sala exclusiva", image: tablePrivativo },
  { id: "balcao", label: "Balcão do Chef", desc: "Experiência imersiva", image: tableBalcao },
  { id: "salao", label: "Salão Principal", desc: "Ambiente clássico", image: tableSalao },
];

const unavailableSlots = new Set(["19:00", "20:30", "21:00"]);

const PaymentCheckout = ({ total, onClose, onConfirm }: { total: string; onClose: () => void; onConfirm: () => void }) => {
  const [ref, setRef] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [expired, setExpired] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (expired) return;
    if (timeLeft <= 0) { setExpired(true); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, expired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (expired) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-background max-w-sm w-full p-10 text-center" onClick={e => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-full border-2 border-foreground/20 flex items-center justify-center mx-auto mb-4">
            <X className="w-5 h-5 text-foreground/40" />
          </div>
          <h3 className="text-lg font-extralight tracking-[0.1em] text-foreground mb-2">{t("checkout.expired")}</h3>
          <p className="text-xs text-muted-foreground mb-6">{t("checkout.expiredDesc")}</p>
          <button onClick={onClose} className="px-8 py-3 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity">{t("del.close")}</button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30 }}
        className="bg-background max-w-md w-full p-8 md:p-10 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"><X className="w-4 h-4" /></button>
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.5em] uppercase text-muted-foreground mb-2">{t("checkout.payment")}</p>
          <h3 className="text-2xl font-extralight tracking-[0.1em] text-foreground">{t("checkout.title")}</h3>
          <div className={`mt-3 text-sm font-light tracking-wider ${timeLeft < 60 ? "text-destructive" : "text-muted-foreground"}`}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        </div>
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">{t("checkout.scan")}</p>
          <div className="w-48 h-48 mx-auto bg-foreground p-3 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect fill="white" width="100" height="100"/>
              {[0,20,40,60,80].map(x => [0,20,40,60,80].map(y => (
                (x+y) % 40 !== 20 && <rect key={`${x}-${y}`} x={x+2} y={y+2} width="16" height="16" fill="black" rx="1"/>
              )))}
              <rect x="30" y="30" width="40" height="40" fill="white"/>
              <rect x="35" y="35" width="30" height="30" fill="black" rx="2"/>
              <rect x="40" y="40" width="20" height="20" fill="white" rx="1"/>
              <text x="50" y="53" textAnchor="middle" fontSize="8" fill="black" fontWeight="bold">S</text>
            </svg>
          </div>
          <p className="text-xs text-muted-foreground">Stilvoll GmbH • Berlim</p>
        </div>
        <div className="border-t border-border pt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("checkout.value")}</span>
            <span className="font-medium text-foreground">{total}</span>
          </div>
          <input type="text" placeholder={t("del.payRef")} value={ref} onChange={e => setRef(e.target.value)}
            className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
          <button onClick={onConfirm} className="w-full py-4 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity">
            {t("checkout.confirm")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface ReservationSectionProps {
  preselectedUnit?: string;
  requireAuth?: () => boolean;
}

const ReservationSection = ({ preselectedUnit, requireAuth }: ReservationSectionProps) => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [selectedUnit, setSelectedUnit] = useState(preselectedUnit || "");
  const [selectedTable, setSelectedTable] = useState("");
  const [guests, setGuests] = useState("2");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [payment, setPayment] = useState("local");
  const [name, setName] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (preselectedUnit) setSelectedUnit(preselectedUnit);
  }, [preselectedUnit]);

  const availableHours = useMemo(() => {
    if (!date) return [];
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    const startHour = isWeekend ? 19 : 18;
    const endHour = isWeekend ? 23 : 24;
    const hours: string[] = [];
    for (let h = startHour; h < endHour; h++) {
      hours.push(`${h.toString().padStart(2, "0")}:00`);
      hours.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return hours;
  }, [date]);

  const persistReservation = () => {
    if (!date) return;
    const unitData = unitOptions.find(u => u.id === selectedUnit);
    const tableData = tables.find(t2 => t2.id === selectedTable);
    reservationStore.add({
      name,
      unit: selectedUnit,
      unitLabel: unitData?.label || selectedUnit,
      table: selectedTable,
      tableLabel: tableData?.label || selectedTable,
      guests: Number(guests),
      date: date.toISOString(),
      time,
      payment: payment as "local" | "online",
    });
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireAuth && !requireAuth()) return;
    
    const newErrors = [];
    if (!selectedUnit) newErrors.push("unit");
    if (!selectedTable) newErrors.push("table");
    if (!name) newErrors.push("name");
    if (!date) newErrors.push("date");
    if (!time) newErrors.push("time");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      toast.error(t("res.fillAll"));
      return;
    }
    
    setErrors([]);
    if (payment === "online") {
      setShowCheckout(true);
    } else {
      persistReservation();
      setShowSuccess(true);
    }
  };

  const selectedUnitData = unitOptions.find(u => u.id === selectedUnit);
  const selectedTableData = tables.find(t2 => t2.id === selectedTable);

  return (
    <>
      <section id="reserva" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div ref={sectionRef} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-xs tracking-[0.5em] uppercase text-muted-foreground mb-4">{t("res.subtitle")}</p>
            <h2 className="text-3xl md:text-5xl font-extralight tracking-[0.1em] text-foreground">{t("res.title")}</h2>
            <p className="text-xs text-muted-foreground mt-4 font-light">{t("res.hours")}</p>
          </motion.div>

          <form onSubmit={handleReserve} className="max-w-2xl mx-auto space-y-10">
            <div>
              <p className={`text-xs tracking-[0.3em] uppercase mb-4 ${errors.includes("unit") ? "text-[#ff6b6b]" : "text-muted-foreground"}`}>{t("res.unitQ")}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {unitOptions.map((unit) => (
                  <button type="button" key={unit.id} onClick={() => { setSelectedUnit(unit.id); setErrors(e => e.filter(x => x !== "unit")); }}
                    aria-pressed={selectedUnit === unit.id}
                    className={`relative overflow-hidden text-left transition-all duration-300 group ${selectedUnit === unit.id ? "ring-2 ring-foreground" : errors.includes("unit") ? "ring-1 ring-[#ff6b6b] hover:ring-[#ff6b6b]/70" : "ring-1 ring-border hover:ring-foreground/30"}`}>
                    <img src={unit.image} alt={unit.label} className="w-full h-28 object-cover" loading="lazy" width={896} height={512} />
                    <div className={`p-3 transition-colors ${selectedUnit === unit.id ? "bg-foreground text-background" : "bg-background"}`}>
                      <p className="text-sm font-medium">{unit.label}</p>
                      <p className={`text-xs mt-0.5 ${selectedUnit === unit.id ? "text-background/60" : "text-muted-foreground"}`}>{unit.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {selectedUnitData && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-4">
                    <img src={selectedUnitData.image} alt={selectedUnitData.label} className="w-full h-48 md:h-56 object-cover" loading="lazy" width={896} height={512} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <p className={`text-xs tracking-[0.3em] uppercase mb-4 ${errors.includes("table") ? "text-[#ff6b6b]" : "text-muted-foreground"}`}>{t("res.table")}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tables.map((table) => (
                  <button type="button" key={table.id} onClick={() => { setSelectedTable(table.id); setErrors(e => e.filter(x => x !== "table")); }}
                    aria-pressed={selectedTable === table.id}
                    className={`relative overflow-hidden text-left transition-all duration-300 group ${selectedTable === table.id ? "ring-2 ring-foreground" : errors.includes("table") ? "ring-1 ring-[#ff6b6b] hover:ring-[#ff6b6b]/70" : "ring-1 ring-border hover:ring-foreground/30"}`}>
                    <img src={table.image} alt={table.label} className="w-full h-24 object-cover" loading="lazy" width={400} height={200} />
                    <div className={`p-3 transition-colors ${selectedTable === table.id ? "bg-foreground text-background" : "bg-background"}`}>
                      <p className="text-sm font-medium">{table.label}</p>
                      <p className={`text-xs mt-0.5 ${selectedTable === table.id ? "text-background/60" : "text-muted-foreground"}`}>{table.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {selectedTableData && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-4">
                    <img src={selectedTableData.image} alt={selectedTableData.label} className="w-full h-48 md:h-64 object-cover rounded" loading="lazy" width={800} height={400} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <input type="text" placeholder={t("res.name")} value={name} onChange={(e) => { setName(e.target.value); setErrors(errs => errs.filter(x => x !== "name")); }}
                aria-invalid={errors.includes("name") ? "true" : "false"}
                className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors ${errors.includes("name") ? "border-[#ff6b6b] text-[#ff6b6b] placeholder:text-[#ff6b6b]/60 focus:border-[#ff6b6b]" : "border-border text-foreground placeholder:text-muted-foreground focus:border-foreground"}`} />
              <select value={guests} onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors">
                {[1,2,3,4,5,6,7,8,10,12].map(n => <option key={n} value={n}>{n} {n === 1 ? t("res.person") : t("res.people")}</option>)}
              </select>
            </div>

            <div>
              <p className={`text-xs tracking-[0.3em] uppercase mb-4 ${errors.includes("date") ? "text-[#ff6b6b]" : "text-muted-foreground"}`}>{t("res.date")}</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button"
                    className={cn("w-full flex items-center gap-3 border-b py-3 text-sm text-left transition-colors focus:outline-none", errors.includes("date") ? "border-[#ff6b6b] text-[#ff6b6b]" : "border-border focus:border-foreground", !date && !errors.includes("date") && "text-muted-foreground")}>
                    <CalendarIcon className={`w-4 h-4 ${errors.includes("date") ? "text-[#ff6b6b]" : "text-muted-foreground"}`} />
                    {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : t("res.selectDate")}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-border" align="start">
                  <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setTime(""); }} disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))} locale={ptBR} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>

            {date && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <p className={`text-xs tracking-[0.3em] uppercase mb-4 ${errors.includes("time") ? "text-[#ff6b6b]" : "text-muted-foreground"}`}>{t("res.time")}</p>
                <div className="flex flex-wrap gap-2">
                  {availableHours.map(h => {
                    const disabled = unavailableSlots.has(h);
                    const selected = time === h;
                    return (
                      <button type="button" key={h} disabled={disabled} onClick={() => { if (!disabled) { setTime(h); setErrors(e => e.filter(x => x !== "time")); } }}
                        aria-pressed={selected}
                        className={cn(
                          "px-4 py-2 text-xs tracking-wider border rounded-full transition-all duration-200",
                          selected ? "bg-foreground text-background border-foreground"
                            : disabled ? "border-border/50 text-muted-foreground/30 cursor-not-allowed"
                            : errors.includes("time") ? "border-[#ff6b6b] text-[#ff6b6b] hover:border-[#ff6b6b]/70"
                            : "border-border text-foreground hover:border-foreground/50"
                        )}>
                        {h}
                        {disabled && <span className="ml-1 text-[9px] opacity-50">{t("res.full")}</span>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">{t("res.payment")}</p>
              <div className="flex gap-4">
                {[{ id: "local", label: t("res.payLocal") }, { id: "online", label: t("res.payOnline") }].map((opt) => (
                  <button type="button" key={opt.id} onClick={() => setPayment(opt.id)}
                    aria-pressed={payment === opt.id}
                    className={`flex items-center gap-2 px-6 py-3 border text-xs tracking-[0.15em] uppercase transition-all duration-300 ${payment === opt.id ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/30 text-foreground"}`}>
                    {payment === opt.id && <Check className="w-3 h-3" />}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity">
              {t("res.confirm")}
            </button>
          </form>
        </div>
      </section>

      <AnimatePresence>
        {showCheckout && (
          <PaymentCheckout total="€50" onClose={() => setShowCheckout(false)} onConfirm={() => { setShowCheckout(false); persistReservation(); setShowSuccess(true); }} />
        )}
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4" onClick={() => setShowSuccess(false)}>
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.97 }}
              className="bg-background max-w-sm w-full p-8 md:p-10 relative text-center" onClick={(e) => e.stopPropagation()}
              role="dialog" aria-modal="true" aria-label="Reserva Confirmada">
              <button onClick={() => setShowSuccess(false)} aria-label="Fechar popup" className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"><X className="w-4 h-4 text-foreground" aria-hidden="true" /></button>
              <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-4"><Check className="w-6 h-6" /></div>
              <h4 className="text-lg font-light text-foreground mb-2">Reserva Confirmada</h4>
              <p className="text-sm text-muted-foreground mb-8">Sua mesa foi garantida com sucesso. Aguardamos sua visita!</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => { setShowSuccess(false); navigate("/dashboard?tab=reservations"); }} className="w-full py-3 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity">Ver Minhas Reservas</button>
                <button onClick={() => setShowSuccess(false)} className="w-full py-3 border border-border text-xs tracking-[0.3em] uppercase hover:border-foreground/30 transition-colors">Fechar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReservationSection;
