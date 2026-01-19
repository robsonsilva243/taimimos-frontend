import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useOverdueInstallments() {
  const [overdueCount, setOverdueCount] = useState(0);
  const [overdueList, setOverdueList] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get("/installments");
      const today = new Date().toISOString().slice(0, 10);

      const overdue = res.data.filter(
        (i) =>
          i.status !== "Pago" &&
          i.vencimento &&
          i.vencimento < today
      );

      setOverdueCount(overdue.length);
      setOverdueList(overdue);
    }

    load();
  }, []);

  return {
    overdueCount,
    overdueList,
  };
}
