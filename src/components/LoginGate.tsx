import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Eye, EyeOff, X } from "lucide-react";

interface LoginGateProps {
  onLogin: () => void;
  onGuest: () => void;
  isPopup?: boolean;
  onClose?: () => void;
}

const LoginGate = ({ onLogin, onGuest, isPopup = false, onClose }: LoginGateProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFaCode, setTwoFaCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [show2fa, setShow2fa] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useLanguage();

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePassword = (p: string) => p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!validateEmail(email)) errs.email = t("login.invalidEmail");
    if (!validatePassword(password)) errs.password = t("login.weakPassword");
    if (mode === "register" && password !== confirmPassword) errs.confirm = t("login.noMatch");

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    if (!show2fa) { setShow2fa(true); setErrors({}); return; }
    if (twoFaCode.length !== 6) { setErrors({ twofa: t("login.invalid2fa") }); return; }

    onLogin();
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-sm w-full relative"
    >
      {isPopup && onClose && (
        <button onClick={onClose} aria-label="Fechar login" className="absolute -top-2 -right-2 p-2 hover:bg-muted rounded-full transition-colors"><X className="w-4 h-4" aria-hidden="true" /></button>
      )}

      <div className="text-center mb-10">
        <h1 className="text-3xl font-extralight tracking-[0.3em] text-foreground mb-2">STILVOLL</h1>
        <div className="h-px bg-border w-16 mx-auto mb-4" />
        <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground">Privé</p>
      </div>

      <div className="flex mb-8 border-b border-border" role="tablist">
        {(["login", "register"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setShow2fa(false); setErrors({}); }}
            role="tab"
            aria-selected={mode === m}
            className={`flex-1 pb-3 text-xs tracking-[0.3em] uppercase transition-colors ${mode === m ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground"}`}>
            {m === "login" ? t("login.enter") : t("login.register")}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!show2fa ? (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input type="email" placeholder={t("login.email")} value={email} onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
              {errors.email && <p className="text-[10px] text-destructive mt-1" role="alert">{errors.email}</p>}
            </div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder={t("login.password")} value={password} onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Exibir senha"} className="absolute right-0 top-3 p-1 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
              </button>
              {errors.password && <p className="text-[10px] text-destructive mt-1" role="alert">{errors.password}</p>}
            </div>
            {mode === "register" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <input type="password" placeholder={t("login.confirmPassword")} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-invalid={!!errors.confirm}
                  className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
                {errors.confirm && <p className="text-[10px] text-destructive mt-1" role="alert">{errors.confirm}</p>}
              </motion.div>
            )}
            <p className="text-[10px] text-muted-foreground">{t("login.passwordHint")}</p>
            <button type="submit" className="w-full py-3 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity">
              {mode === "login" ? t("login.enter") : t("login.register")}
            </button>
          </motion.form>
        ) : (
          <motion.form key="2fa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-4">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{t("login.2faTitle")}</p>
              <p className="text-[10px] text-muted-foreground">{t("login.2faDesc")}</p>
            </div>
            <input type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={twoFaCode}
              onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              aria-invalid={!!errors.twofa}
              className="w-full bg-transparent border-b border-border py-3 text-center text-2xl tracking-[0.5em] font-light text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
            {errors.twofa && <p className="text-[10px] text-destructive mt-1 text-center" role="alert">{errors.twofa}</p>}
            <button type="submit" className="w-full py-3 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity">
              {t("login.verify")}
            </button>
            <button type="button" onClick={() => setShow2fa(false)} className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider uppercase">
              {t("login.back")}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <button onClick={onGuest} className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
          {t("login.guest")}
        </button>
      </div>
    </motion.div>
  );

  if (isPopup) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm px-6" onClick={onClose}>
        <div onClick={e => e.stopPropagation()} className="bg-background p-8 md:p-10 rounded-sm max-w-sm w-full">
          {content}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-6">
      {content}
    </div>
  );
};

export default LoginGate;
