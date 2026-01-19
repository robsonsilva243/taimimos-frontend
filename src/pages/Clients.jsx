import { useEffect, useState } from "react";
import { api } from "../services/api";

export function Clients() {
  const [clients, setClients] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  async function loadClients() {
    const res = await api.get("/clients");
    setClients(res.data);
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (editId) {
      await api.put(`/clients/${editId}`, { nome, telefone, email });
      setEditId(null);
    } else {
      await api.post("/clients", { nome, telefone, email });
    }

    setNome("");
    setTelefone("");
    setEmail("");
    loadClients();
  }

  async function handleDelete(id) {
    if (confirm("Deseja excluir este cliente?")) {
      await api.delete(`/clients/${id}`);
      loadClients();
    }
  }

  function handleEdit(client) {
    setEditId(client.id);
    setNome(client.nome);
    setTelefone(client.telefone);
    setEmail(client.email);
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-taimpink">
        Cadastro de Clientes
      </h2>

      {/* FORMULÁRIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-taimpink"
          placeholder="Nome do cliente"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-taisky"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <input
          className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-taiyellow"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="md:col-span-3 flex flex-wrap gap-3">
          <button
            type="submit"
            className="bg-taimpink text-white px-6 py-3 rounded-lg hover:opacity-90"
          >
            {editId ? "Atualizar Cliente" : "Salvar Cliente"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setNome("");
                setTelefone("");
                setEmail("");
              }}
              className="border px-6 py-3 rounded-lg"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTAGEM */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full hidden md:table">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Nome</th>
              <th className="p-4">Telefone</th>
              <th className="p-4">Email</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-4">{c.nome}</td>
                <td className="p-4 text-center">{c.telefone}</td>
                <td className="p-4 text-center">{c.email}</td>
                <td className="p-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-taisky font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-500 font-semibold"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y">
          {clients.map((c) => (
            <div key={c.id} className="p-4 space-y-2">
              <p className="font-semibold text-lg">{c.nome}</p>
              <p className="text-sm">📞 {c.telefone || "-"}</p>
              <p className="text-sm">📧 {c.email || "-"}</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="text-taisky font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-500 font-semibold"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && (
          <p className="p-6 text-center text-gray-400">
            Nenhum cliente cadastrado
          </p>
        )}
      </div>
    </div>
  );
}