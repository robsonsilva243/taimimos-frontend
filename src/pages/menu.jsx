import { Link } from "react-router-dom";
import { useOverdueInstallments } from "../hooks/useOverdueInstallments";

export function Sidebar() {
  const { overdueCount } = useOverdueInstallments();

  return (
    <aside className="w-64 bg-white shadow-lg p-4">
      <nav className="space-y-4">

        <Link to="/dashboard" className="block font-medium">
          Dashboard
        </Link>

        <Link
          to="/receivable"
          className="flex items-center justify-between font-medium"
        >
          <span>Contas a Receber</span>

          {overdueCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              {overdueCount}
            </span>
          )}
        </Link>

        <Link to="/orders" className="block font-medium">
          Pedidos
        </Link>

        <Link to="/clients" className="block font-medium">
          Clientes
        </Link>

      </nav>
    </aside>
  );
}
