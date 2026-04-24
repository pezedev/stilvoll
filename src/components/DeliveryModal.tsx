import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { featuredDishes, accordionDishes, type DishType } from "./MenuGrid";
import { drinkCategories, type DrinkItem } from "./DrinksSection";
import { useLanguage } from "@/i18n/LanguageContext";
import { orderStore } from "@/lib/userStore";

interface CartItem {
  name: string;
  price: number;
  qty: number;
  type: "prato" | "bebida";
  image: string;
}

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const allDishes: DishType[] = [...featuredDishes, ...accordionDishes];
const allDrinks: DrinkItem[] = drinkCategories.flatMap(c => c.items);

const DeliveryModal = ({ isOpen, onClose }: DeliveryModalProps) => {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [address, setAddress] = useState({ rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" });
  const [cepLoading, setCepLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const fetchCep = useCallback(async (cep: string) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddress(prev => ({ ...prev, rua: data.logradouro || prev.rua, bairro: data.bairro || prev.bairro, cidade: data.localidade || prev.cidade, estado: data.uf || prev.estado }));
      }
    } catch { /* silently fail */ }
    setCepLoading(false);
  }, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payRef, setPayRef] = useState("");

  const addToCart = (itemName: string, price: number, type: "prato" | "bebida", image: string) => {
    setCart(prev => ({ ...prev, [itemName]: { name: itemName, price, qty: (prev[itemName]?.qty || 0) + 1, type, image } }));
  };

  const removeFromCart = (itemName: string) => {
    setCart(prev => {
      const c = { ...prev };
      if (c[itemName] && c[itemName].qty > 1) c[itemName] = { ...c[itemName], qty: c[itemName].qty - 1 };
      else delete c[itemName];
      return c;
    });
  };

  const cartItems = Object.values(cart);
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const handleNext = () => {
    if (step === 1) {
      if (cartItems.length === 0) { toast.error(t("del.addItem")); return; }
      setStep(2);
    } else if (step === 2) {
      const newErrors = [];
      if (!name) newErrors.push("name");
      if (!phone) newErrors.push("phone");
      if (newErrors.length > 0) { setErrors(newErrors); toast.error(t("del.fillName")); return; }
      setErrors([]);
      setStep(3);
    } else if (step === 3) {
      const newErrors = [];
      if (!address.rua) newErrors.push("rua");
      if (!address.numero) newErrors.push("numero");
      if (!address.cidade) newErrors.push("cidade");
      if (newErrors.length > 0) { setErrors(newErrors); toast.error(t("del.fillAddr")); return; }
      setErrors([]);
      setStep(4);
    } else if (step === 4) {
      orderStore.add({
        items: cartItems.map(i => ({ name: i.name, qty: i.qty, price: i.price, image: i.image })),
        total,
        address: `${address.rua}, ${address.numero} — ${address.bairro}, ${address.cidade}/${address.estado}`,
        status: "preparing",
      });
      setStep(5);
      setTimeout(() => toast.success(t("del.success")), 500);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStep(1); setCart({}); setAddress({ rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" }); setName(""); setPhone(""); setPayRef(""); setErrors([]); }, 300);
  };

  const ItemRow = ({ itemName, price, type, image }: { itemName: string; price: number; type: "prato" | "bebida"; image: string }) => {
    const qty = cart[itemName]?.qty || 0;
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img src={image} alt={itemName} className="w-8 h-8 rounded-sm object-cover flex-shrink-0" loading="lazy" width={32} height={32} />
          <span className="text-sm text-foreground font-light truncate">{itemName}</span>
        </div>
        <span className="text-xs text-muted-foreground mr-3 flex-shrink-0">€{price}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {qty > 0 && (
            <>
              <button onClick={() => removeFromCart(itemName)} aria-label={`Remover um ${itemName}`} className="w-6 h-6 flex items-center justify-center border border-border rounded-full hover:border-foreground transition-colors"><Minus className="w-3 h-3" aria-hidden="true" /></button>
              <motion.span key={qty} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-sm w-4 text-center font-medium" aria-live="polite">{qty}</motion.span>
            </>
          )}
          <button onClick={() => addToCart(itemName, price, type, image)} aria-label={`Adicionar um ${itemName}`} className="w-6 h-6 flex items-center justify-center border border-border rounded-full hover:border-foreground transition-colors"><Plus className="w-3 h-3" aria-hidden="true" /></button>
        </div>
      </div>
    );
  };

  const ReceiptSummary = () => (
    <div className="border border-border p-6 space-y-3">
      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t("del.summary")}</p>
      {cartItems.map(item => (
        <div key={item.name} className="flex items-center gap-3 py-1.5">
          <img src={item.image} alt={item.name} className="w-8 h-8 rounded-sm object-cover flex-shrink-0" loading="lazy" width={32} height={32} />
          <span className="text-sm font-light text-foreground flex-1 truncate">{item.name}</span>
          <span className="text-xs text-muted-foreground">{item.qty}x</span>
          <span className="text-sm text-foreground">€{(item.price * item.qty).toFixed(0)}</span>
        </div>
      ))}
      <div className="border-t border-border pt-3 flex justify-between">
        <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{t("del.total")}</span>
        <span className="text-lg font-light text-foreground">€{total.toFixed(0)}</span>
      </div>
    </div>
  );

  const DeliveryPaymentStep = ({ total: t2, cartItems: ci, payRef: pr, setPayRef: spr, handleNext: hn, ReceiptSummary: RS, handleClose: hc }: any) => {
    const [timeLeft, setTimeLeft] = useState(180);
    const expired = timeLeft <= 0;

    useEffect(() => {
      if (expired) return;
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }, [expired]);

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    if (expired) {
      return (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center mx-auto mb-4">
            <X className="w-5 h-5 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-light text-foreground mb-2">{t("checkout.expired")}</h4>
          <p className="text-xs text-muted-foreground mb-6">{t("checkout.expiredDesc")}</p>
          <button onClick={hc} className="px-8 py-3 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity">{t("del.close")}</button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <RS />
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">{t("del.scanPay")}</p>
          <div className={`text-sm font-light tracking-wider mb-3 ${timeLeft < 60 ? "text-destructive" : "text-muted-foreground"}`}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
          <div className="w-40 h-40 mx-auto bg-foreground p-2.5 mb-3">
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
        <input type="text" placeholder={t("del.payRef")} value={pr} onChange={(e: any) => spr(e.target.value)}
          className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
        <button onClick={hn} className="w-full py-3 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity">{t("del.confirmPay")}</button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4" onClick={handleClose}>
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.97 }}
            className="bg-background max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 md:p-10 relative" onClick={(e) => e.stopPropagation()}
            role="dialog" aria-modal="true" aria-label={t("del.title")}>
            <button onClick={handleClose} aria-label="Fechar modal de delivery" className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"><X className="w-4 h-4 text-foreground" aria-hidden="true" /></button>

            <div className="text-center mb-6">
              <p className="text-xs tracking-[0.5em] uppercase text-muted-foreground mb-2">Stilvoll</p>
              <h3 className="text-2xl font-extralight tracking-[0.1em] text-foreground">{t("del.title")}</h3>
              <div className="flex justify-center gap-2 mt-4">
                {[1,2,3,4,5].map((s) => (
                  <div key={s} className={`w-5 h-0.5 transition-colors ${step >= s ? "bg-foreground" : "bg-border"}`} />
                ))}
              </div>
            </div>

            {step === 5 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-4"><Check className="w-6 h-6" /></div>
                <h4 className="text-lg font-light text-foreground mb-2">{t("del.confirmed")}</h4>
                <p className="text-sm text-muted-foreground mb-1">{t("del.total")}: €{total.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground mb-8">{t("del.delivery")}</p>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <button onClick={() => { handleClose(); navigate("/dashboard?tab=orders"); }} className="w-full py-3 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity">Acompanhar Pedido</button>
                  <button onClick={handleClose} className="w-full py-3 border border-border text-xs tracking-[0.3em] uppercase hover:border-foreground/30 transition-colors">Voltar ao Menu</button>
                </div>
              </motion.div>
            ) : step === 1 ? (
              <div className="space-y-6">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t("del.dishes")}</p>
                  {allDishes.map(d => <ItemRow key={d.name} itemName={d.name} price={d.priceNum} type="prato" image={d.image} />)}
                </div>
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t("del.drinks")}</p>
                  {allDrinks.map(d => <ItemRow key={d.name} itemName={d.name} price={d.priceNum} type="bebida" image={d.image} />)}
                </div>
                {cartItems.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2"><ShoppingBag className="w-3 h-3" /> {cartItems.reduce((s,i)=>s+i.qty,0)} {t("del.items")}</span>
                      <span className="text-sm font-medium text-foreground">{t("del.total")}: €{total.toFixed(0)}</span>
                    </div>
                  </motion.div>
                )}
                <button onClick={handleNext} className="w-full py-3 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity">{t("del.next")}</button>
              </div>
            ) : step === 4 ? (
              <DeliveryPaymentStep total={total} cartItems={cartItems} payRef={payRef} setPayRef={setPayRef} handleNext={handleNext} ReceiptSummary={ReceiptSummary} handleClose={handleClose} />
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-5">
                {step === 2 ? (
                  <>
                    <input type="text" placeholder={t("del.fullName")} value={name} onChange={(e) => { setName(e.target.value); setErrors(errs => errs.filter(x => x !== "name")); }}
                      aria-invalid={errors.includes("name")}
                      className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors ${errors.includes("name") ? "border-[#ff6b6b] text-[#ff6b6b] placeholder:text-[#ff6b6b]/60 focus:border-[#ff6b6b]" : "border-border text-foreground placeholder:text-muted-foreground focus:border-foreground"}`} />
                    <input type="tel" placeholder={t("del.phone")} value={phone} onChange={(e) => { setPhone(e.target.value); setErrors(errs => errs.filter(x => x !== "phone")); }}
                      aria-invalid={errors.includes("phone")}
                      className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors ${errors.includes("phone") ? "border-[#ff6b6b] text-[#ff6b6b] placeholder:text-[#ff6b6b]/60 focus:border-[#ff6b6b]" : "border-border text-foreground placeholder:text-muted-foreground focus:border-foreground"}`} />
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <input type="text" placeholder={t("del.cep")} value={address.cep}
                        onChange={(e) => { const val = e.target.value; setAddress(prev => ({ ...prev, cep: val })); fetchCep(val); }}
                        className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
                      {cepLoading && <Loader2 className="w-4 h-4 animate-spin absolute right-0 top-3.5 text-muted-foreground" />}
                    </div>
                    <input type="text" placeholder={t("del.street")} value={address.rua} onChange={(e) => { setAddress({ ...address, rua: e.target.value }); setErrors(errs => errs.filter(x => x !== "rua")); }}
                      aria-invalid={errors.includes("rua")}
                      className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors ${errors.includes("rua") ? "border-[#ff6b6b] text-[#ff6b6b] placeholder:text-[#ff6b6b]/60 focus:border-[#ff6b6b]" : "border-border text-foreground placeholder:text-muted-foreground focus:border-foreground"}`} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder={t("del.number")} value={address.numero} onChange={(e) => { setAddress({ ...address, numero: e.target.value }); setErrors(errs => errs.filter(x => x !== "numero")); }}
                        aria-invalid={errors.includes("numero")}
                        className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors ${errors.includes("numero") ? "border-[#ff6b6b] text-[#ff6b6b] placeholder:text-[#ff6b6b]/60 focus:border-[#ff6b6b]" : "border-border text-foreground placeholder:text-muted-foreground focus:border-foreground"}`} />
                      <input type="text" placeholder={t("del.neighborhood")} value={address.bairro} onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <input type="text" placeholder={t("del.city")} value={address.cidade} onChange={(e) => { setAddress({ ...address, cidade: e.target.value }); setErrors(errs => errs.filter(x => x !== "cidade")); }}
                        aria-invalid={errors.includes("cidade")}
                        className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-colors ${errors.includes("cidade") ? "border-[#ff6b6b] text-[#ff6b6b] placeholder:text-[#ff6b6b]/60 focus:border-[#ff6b6b]" : "border-border text-foreground placeholder:text-muted-foreground focus:border-foreground"}`} />
                      <input type="text" placeholder={t("del.state")} value={address.estado} onChange={(e) => setAddress({ ...address, estado: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
                    </div>
                  </>
                )}
                <ReceiptSummary />
                <button type="submit" className="w-full py-3 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity">
                  {step === 2 ? t("del.next") : t("del.goPayment")}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeliveryModal;
