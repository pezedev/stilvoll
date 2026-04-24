import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { CalendarCheck2, Package, ArrowLeft, Clock, MapPin, Users, LogOut, AlertTriangle, Check, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrders, useReservations } from "@/hooks/useStilvollStore";
import { reservationStore, type OrderStatus, type StoredReservation } from "@/lib/userStore";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { differenceInMinutes } from "date-fns";

const statusLabel = (status: OrderStatus, t: (k: string) => string) => {
  switch (status) {
    case "pending": return t("account.status.pending");
    case "preparing": return t("account.status.preparing");
    case "out_for_delivery": return t("account.status.outForDelivery");
    case "delivered": return t("account.status.delivered");
    case "cancelled": return t("account.status.cancelled");
    default: return status;
  }
};

const statusDot = (status: OrderStatus) => {
  if (status === "cancelled") return "bg-destructive";
  if (status === "delivered") return "bg-foreground/30";
  return "bg-foreground animate-pulse";
};

const fmtDate = (ts: number) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(ts);

const fmtDateTime = (ts: number) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(ts);

const DashboardPage = () => {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const orders = useOrders();
  const reservations = useReservations();
  const [cancellingRes, setCancellingRes] = useState<StoredReservation | null>(null);

  const activeTab = searchParams.get("tab") === "reservations" ? "reservations" : "orders";

  const totals = useMemo(() => ({
    activeRes: reservations.filter(r => r.status === "active").length,
  }), [reservations]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCancelReservation = (res: StoredReservation) => {
    const eventDate = new Date(res.date);
    const [hours, mins] = res.time.split(":");
    eventDate.setHours(parseInt(hours), parseInt(mins), 0, 0);
    
    const now = new Date();
    const diff = differenceInMinutes(eventDate, now);

    if (diff < 0) {
      toast.error("Não é possível cancelar uma reserva que já passou.");
      return;
    }

    setCancellingRes(res);
  };

  const confirmCancellation = () => {
    if (!cancellingRes) return;
    
    reservationStore.cancel(cancellingRes.id);
    
    const eventDate = new Date(cancellingRes.date);
    const [hours, mins] = cancellingRes.time.split(":");
    eventDate.setHours(parseInt(hours), parseInt(mins), 0, 0);
    const diff = differenceInMinutes(eventDate, new Date());

    if (diff <= 60) {
      toast.success("Reserva cancelada. Uma taxa de €47 foi cobrada conforme nossa política de cancelamento tardio.");
    } else {
      toast.success("Reserva cancelada com sucesso.");
    }
    
    setCancellingRes(null);
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t("account.back")}
            </Link>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-xs tracking-[0.5em] uppercase text-muted-foreground mb-2">Painel de Controle</p>
              <h1 className="text-3xl md:text-5xl font-extralight tracking-[0.1em] text-foreground">Bem-vindo(a)</h1>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
             <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-foreground/30 px-6 py-3 rounded-sm"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </button>
          </motion.div>
        </header>

        <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })} className="space-y-12">
          <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none p-0 h-auto gap-8">
            <TabsTrigger value="orders" className="text-xs tracking-[0.2em] uppercase rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none px-0 py-4 bg-transparent">
              Meus Pedidos
            </TabsTrigger>
            <TabsTrigger value="reservations" className="text-xs tracking-[0.2em] uppercase rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none px-0 py-4 bg-transparent">
              Minhas Reservas
            </TabsTrigger>
          </TabsList>



          <TabsContent value="orders" className="animate-in fade-in-50 duration-500">
            {orders.length === 0 ? (
              <EmptyState label={t("account.empty.orders")} icon={<Package className="w-8 h-8 opacity-20 mx-auto mb-4" />} />
            ) : (
              <div className="grid gap-5">
                {orders.map((o, i) => (
                  <motion.article
                    key={o.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="border border-border bg-card p-6 md:p-8 hover:border-foreground/40 transition-colors rounded-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div>
                        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-1">Pedido #{o.id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-foreground font-light">{fmtDateTime(o.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-full bg-background/50">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot(o.status)}`} />
                        <span className="text-[10px] tracking-[0.2em] uppercase text-foreground">{statusLabel(o.status, t)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {o.items.map((item) => (
                        <div key={item.name} className="flex items-center gap-4 bg-background/50 p-3 rounded-sm border border-border/50">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-sm flex-shrink-0" loading="lazy" width={48} height={48} />
                          <span className="text-sm font-light text-foreground flex-1 truncate">{item.name}</span>
                          <span className="text-xs text-muted-foreground w-8 text-center">{item.qty}×</span>
                          <span className="text-sm text-foreground tabular-nums font-medium">€{(item.price * item.qty).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-border">
                      <p className="text-xs text-muted-foreground font-light flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        {o.address || "—"}
                      </p>
                      <p className="text-lg font-light text-foreground tabular-nums">Total: €{o.total.toFixed(0)}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reservations" className="animate-in fade-in-50 duration-500">
            {reservations.length === 0 ? (
              <EmptyState label={t("account.empty.reservations")} icon={<CalendarCheck2 className="w-8 h-8 opacity-20 mx-auto mb-4" />} />
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {reservations.map((r, i) => (
                  <motion.article
                    key={r.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="border border-border bg-card p-6 md:p-8 hover:border-foreground/40 transition-colors rounded-sm relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full ${r.status === "active" ? "bg-foreground" : "bg-destructive/50"}`} />
                    <div className="flex items-start justify-between mb-6 pl-2">
                      <div>
                        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-2">{r.unitLabel}</p>
                        <h3 className="text-xl font-extralight tracking-[0.05em] text-foreground">{r.name}</h3>
                      </div>
                      <span className={`text-[10px] tracking-[0.25em] uppercase px-2 py-1 border rounded-sm ${r.status === "active" ? "border-foreground/30 text-foreground" : "border-destructive/30 text-destructive"}`}>
                        {r.status === "active" ? t("account.status.active") : t("account.status.cancelled")}
                      </span>
                    </div>

                    <dl className="space-y-4 text-sm font-light text-foreground pl-2 bg-background/50 p-4 rounded-sm border border-border/50">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <dd className="tracking-wider">
                          <span className="font-medium">{fmtDate(new Date(r.date).getTime())}</span> às <span className="font-medium">{r.time}</span>
                        </dd>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <dd>{r.guests} {r.guests === 1 ? t("res.person") : t("res.people")}</dd>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <dd>{r.tableLabel}</dd>
                      </div>
                    </dl>

                    {r.status === "active" && (
                      <div className="mt-6 pl-2">
                        <button
                          onClick={() => handleCancelReservation(r)}
                          className="text-[10px] tracking-[0.2em] uppercase text-destructive hover:text-destructive/80 transition-colors font-medium border-b border-destructive/20 pb-0.5"
                        >
                          Cancelar Reserva
                        </button>
                      </div>
                    )}
                  </motion.article>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AnimatePresence>
        {cancellingRes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4"
            onClick={() => setCancellingRes(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              className="bg-background max-w-sm w-full p-8 md:p-10 relative text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setCancellingRes(null)}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
              
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <h4 className="text-lg font-light text-foreground mb-2">Cancelar Reserva?</h4>
              
              {(() => {
                const eventDate = new Date(cancellingRes.date);
                const [hours, mins] = cancellingRes.time.split(":");
                eventDate.setHours(parseInt(hours), parseInt(mins), 0, 0);
                const diff = differenceInMinutes(eventDate, new Date());
                
                if (diff <= 60) {
                  return (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Sua reserva é em menos de 1 hora. Conforme nossa política, será cobrada uma taxa de <span className="font-medium text-foreground">€47</span>.
                      </p>
                      <p className="text-xs text-destructive font-medium uppercase tracking-wider">Taxa de cancelamento tardio aplicável</p>
                    </div>
                  );
                }
                
                return (
                  <p className="text-sm text-muted-foreground">
                    Deseja realmente cancelar sua reserva? Esta ação não pode ser desfeita.
                  </p>
                );
              })()}

              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={confirmCancellation}
                  className="w-full py-3 bg-destructive text-destructive-foreground text-xs tracking-[0.3em] uppercase hover:opacity-90 transition-opacity"
                >
                  Confirmar Cancelamento
                </button>
                <button
                  onClick={() => setCancellingRes(null)}
                  className="w-full py-3 border border-border text-xs tracking-[0.3em] uppercase hover:border-foreground/30 transition-colors"
                >
                  Manter Reserva
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

const EmptyState = ({ label, icon }: { label: string, icon?: React.ReactNode }) => (
  <div className="border border-dashed border-border py-24 px-6 text-center rounded-sm bg-card/50">
    {icon}
    <p className="text-sm font-light text-muted-foreground tracking-wider">{label}</p>
  </div>
);

export default DashboardPage;
