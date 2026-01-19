import { useEffect, useState } from "react";
import { api } from "../services/api";

export function Receivable() {
  const [receivables, setReceivables] = useState([]);
  const [clients, setClients] = useState([]);
  const [filterClient, setFilterClient] = useState("");

  async function loadData() {
    const [r, c] = await Promise.all([
      api.get("/installments"),
      api.get("/clients"),
    ]);

    setReceivables(r.data);
    setClients(c.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function markAsPaid(id) {
    await api.put(`/installments/${id}`);
    loadData();
  }

  async function handleDelete(id) {
    if (confirm("Excluir parcela paga?")) {
      await api.delete(`/installments/${id}`);
      loadData();
    }
  }

  function getClientName(id) {
    const client = clients.find((c) => c.id === id);
    return client ? client.nome : "—";
  }

  const filtered = filterClient
    ? receivables.filter(
        (r) => r.clientId === Number(filterClient)
      )
    : receivables;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-pink-500">
        Contas a Receber
      </h2>

      {/* FILTRO */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 w-fit">
        <select
          className="border p-2 rounded"
          value={filterClient}
          onChange={(e) => setFilterClient(e.target.value)}
        >
          <option value="">Todos os clientes</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3">Pedido</th>
              <th className="p-3">Parcela</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Vencimento</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ação</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">
                  {getClientName(r.clientId)}
                </td>

                <td className="p-3 text-center">
                  #{r.orderId}
                </td>

                <td className="p-3 text-center">
                  {r.numero}/{r.totalParcelas}
                </td>

                <td className="p-3 text-center">
                  R$ {r.valor.toFixed(2)}
                </td>

                <td className="p-3 text-center">
                  {r.vencimento}
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      r.status === "Pago"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="p-3 text-center space-x-2">
                  {r.status !== "Pago" && (
                    <button
                      onClick={() => markAsPaid(r.id)}
                      className="text-green-600 hover:underline"
                    >
                      Marcar pago
                    </button>
                  )}

                  {r.status === "Pago" && (
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="p-4 text-center text-gray-400"
                >
                  Nenhuma parcela encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}