import { useEffect, useState } from "react";
import { orderStore, reservationStore, type StoredOrder, type StoredReservation } from "@/lib/userStore";

export const useOrders = (): StoredOrder[] => {
  const [orders, setOrders] = useState<StoredOrder[]>(() => orderStore.list());
  useEffect(() => {
    const update = () => setOrders(orderStore.list());
    window.addEventListener("stilvoll:store-update", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("stilvoll:store-update", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return orders;
};

export const useReservations = (): StoredReservation[] => {
  const [list, setList] = useState<StoredReservation[]>(() => reservationStore.list());
  useEffect(() => {
    const update = () => setList(reservationStore.list());
    window.addEventListener("stilvoll:store-update", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("stilvoll:store-update", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return list;
};
