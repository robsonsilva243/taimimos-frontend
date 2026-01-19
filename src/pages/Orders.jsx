import { useEffect, useState } from "react";
import { api } from "../services/api";

export function Orders() {
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);

  const [clientId, setClientId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [dataEntrega, setDataEntrega] = useState("");

  async function loadClients() {
    const res = await api.get("/clients");
    setClients(res.data);
  }

  async function loadOrders() {
    const res = await api.get("/orders");
    setOrders(res.data);
  }

  useEffect(() => {
    loadClients();
    loadOrders();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!clientId || !valor || !parcelas) {
      alert("Preencha cliente, valor e parcelas.");
      return;
    }

    // 🔹 1. CRIAR PEDIDO
    const orderRes = await api.post("/orders", {
      clientId: Number(clientId),
      descricao,
      valor: Number(valor),
      parcelas: Number(parcelas),
      dataEntrega,
    });

    // 🔹 2. CRIAR PARCELAS
    await api.post("/installments", {
      orderId: orderRes.data.id,
      clientId: Number(clientId),
      valorTotal: Number(valor),
      parcelas: Number(parcelas),
    });

    // RESET
    setClientId("");
    setDescricao("");
    setValor("");
    setParcelas(1);
    setDataEntrega("");

    loadOrders();
  }

  async function handleDelete(id) {
    if (confirm("Deseja excluir este pedido?")) {
      await api.delete(`/orders/${id}`);
      loadOrders();
    }
  }

  function getClientName(id) {
    const client = clients.find((c) => c.id === id);
    return client ? client.nome : "—";
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-pink-500">
        Pedidos / Vendas
      </h2>

      {/* FORMULÁRIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-6 gap-4"
      >
        <select
          className="border p-2 rounded md:col-span-2"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        >
          <option value="">Cliente</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded md:col-span-2"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Valor"
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />

        <select
          className="border p-2 rounded"
          value={parcelas}
          onChange={(e) => setParcelas(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6].map((p) => (
            <option key={p} value={p}>
              {p}x
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded"
          type="date"
          value={dataEntrega}
          onChange={(e) => setDataEntrega(e.target.value)}
        />

        <div className="md:col-span-6">
          <button
            type="submit"
            className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600"
          >
            Salvar Pedido
          </button>
        </div>
      </form>

      {/* TABELA */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3">Descrição</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Parcelas</th>
              <th className="p-3">Entrega</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{getClientName(o.clientId)}</td>
                <td className="p-3 text-center">{o.descricao}</td>
                <td className="p-3 text-center">R$ {o.valor}</td>
                <td className="p-3 text-center">{o.parcelas}x</td>
                <td className="p-3 text-center">
                  {o.dataEntrega || "—"}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400">
                  Nenhum pedido cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
