import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { Clients } from "./pages/Clients";
import { Orders } from "./pages/Orders";
import { Receivable } from "./pages/Receivable";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-gray-100 flex flex-col">
        
        {/* HEADER */}
        <header className="bg-taimpink text-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              TaiMimos{" "}
              <span className="text-taiyellow">Personalizados</span>
            </h1>
          </div>
        </header>

        {/* MENU */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-4">
            <Link
              to="/dashboard"
              className="font-semibold text-taimpink hover:text-taisky"
            >
              Dashboard
            </Link>

            <Link
              to="/clients"
              className="font-semibold text-taimpink hover:text-taisky"
            >
              Clientes
            </Link>

            <Link
              to="/orders"
              className="font-semibold text-taimpink hover:text-taisky"
            >
              Pedidos
            </Link>

            <Link
              to="/receivable"
              className="font-semibold text-taimpink hover:text-taisky"
            >
              Contas a Receber
            </Link>
          </div>
        </nav>

        {/* CONTEÚDO */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/receivable" element={<Receivable />} />
            </Routes>
          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;