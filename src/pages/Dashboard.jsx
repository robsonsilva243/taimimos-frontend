import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useOverdueInstallments } from "../hooks/useOverdueInstallments";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#22c55e", "#facc15"];

function Card({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow flex flex-col">
      <span className="text-sm text-gray-500">{title}</span>
      <strong className={`text-2xl md:text-3xl mt-2 ${color}`}>
        {value}
      </strong>
    </div>
  );
}

export function Dashboard() {
  const [installments, setInstallments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [month, setMonth] = useState("");

  /* 🔴 PARCELAS VENCIDAS (HOOK GLOBAL) */
  const { overdueCount, overdueList } = useOverdueInstallments();

  useEffect(() => {
    async function loadData() {
      const [i, o] = await Promise.all([
        api.get("/installments"),
        api.get("/orders"),
      ]);
      setInstallments(i.data);
      setOrders(o.data);
    }
    loadData();
  }, []);

  /* 🔹 FILTRO POR MÊS */
  const filteredInstallments = month
    ? installments.filter(
        (i) => i.vencimento?.startsWith(month)
      )
    : installments;

  /* 🔹 TOTAIS */
  const totalReceber = filteredInstallments.reduce(
    (s, i) => s + Number(i.valor),
    0
  );

  const totalPago = filteredInstallments
    .filter((i) => i.status === "Pago")
    .reduce((s, i) => s + Number(i.valor), 0);

  const totalPendente = totalReceber - totalPago;

  const totalOverdue = overdueList.reduce(
    (s, i) => s + Number(i.valor),
    0
  );

  /* 🔹 EVOLUÇÃO DE VENDAS */
  const salesByMonth = {};
  orders.forEach((o) => {
    if (!o.dataEntrega) return;
    const m = o.dataEntrega.slice(0, 7);
    salesByMonth[m] = (salesByMonth[m] || 0) + Number(o.valor);
  });

  const salesData = Object.keys(salesByMonth).map((m) => ({
    mes: m,
    valor: salesByMonth[m],
  }));

  const pieData = [
    { name: "Pago", value: totalPago },
    { name: "Pendente", value: totalPendente },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-taimpink">
        Dashboard Financeiro
      </h2>

      {/* 🔴 ALERTA GLOBAL */}
      {overdueCount > 0 && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6">
          ⚠️ Existem{" "}
          <strong>{overdueCount}</strong>{" "}
          parcelas vencidas totalizando{" "}
          <strong>R$ {totalOverdue.toFixed(2)}</strong>
        </div>
      )}

      {/* FILTRO */}
      <div className="bg-white p-4 rounded-xl shadow mb-8 flex gap-3 w-fit">
        <label className="text-sm text-gray-500">
          Filtrar por mês:
        </label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded-lg p-2"
        />
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card
          title="Total a Receber"
          value={`R$ ${totalReceber.toFixed(2)}`}
          color="text-taisky"
        />
        <Card
          title="Total Recebido"
          value={`R$ ${totalPago.toFixed(2)}`}
          color="text-green-500"
        />
        <Card
          title="Total Pendente"
          value={`R$ ${totalPendente.toFixed(2)}`}
          color="text-taiyellow"
        />
        <Card
          title="Parcelas Vencidas"
          value={`R$ ${totalOverdue.toFixed(2)}`}
          color="text-red-500"
        />
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-4">
            Evolução de Vendas
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesData}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="valor"
                fill="#ec4899"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-4">
            Pago x Pendente
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
