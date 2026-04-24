import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const RestrictedAccess = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md w-full"
      >
        <div className="w-16 h-16 border border-border rounded-full flex items-center justify-center mx-auto mb-8">
          <Lock className="w-6 h-6 text-foreground" />
        </div>
        
        <p className="text-xs tracking-[0.5em] uppercase text-muted-foreground mb-4">
          Stilvoll
        </p>
        <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.1em] text-foreground mb-6">
          Acesso Restrito
        </h1>
        <p className="text-sm font-light text-muted-foreground mb-12">
          Faça login para acessar esta área exclusiva.
        </p>
        
        <Link
          to="/"
          className="inline-block w-full py-4 bg-foreground text-background text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity mb-4"
        >
          Voltar para Home
        </Link>
        <button
          onClick={() => {
            localStorage.setItem("stilvoll.auth", "true");
            window.location.href = "/dashboard";
          }}
          className="w-full py-4 border border-border text-foreground text-xs tracking-[0.3em] uppercase hover:bg-muted transition-colors"
        >
          Simular Login
        </button>
      </motion.div>
    </main>
  );
};

export default RestrictedAccess;
