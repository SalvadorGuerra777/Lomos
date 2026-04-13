import { useEffect, useMemo, useState } from "react";
import { Package, DollarSign, Scale, Trash2, Wallet, Receipt } from "lucide-react";

const STORAGE_KEY = "registro-lomos-app";

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function App() {
  const [pricePerPound, setPricePerPound] = useState(3);
  const [records, setRecords] = useState([]);
  const [payments, setPayments] = useState([]);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    pounds: "",
    totalCost: "",
    notes: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    notes: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setRecords(parsed.records || []);
      setPayments(parsed.payments || []);
      setPricePerPound(parsed.pricePerPound || 3);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ records, payments, pricePerPound })
    );
  }, [records, payments, pricePerPound]);

  const totals = useMemo(() => {
    const totalPounds = records.reduce((acc, item) => acc + Number(item.pounds), 0);
    const totalSpent = records.reduce((acc, item) => acc + Number(item.totalCost), 0);
    const totalSales = totalPounds * Number(pricePerPound);
    const totalProfit = totalSales - totalSpent;
    const avgCostPerPound = totalPounds > 0 ? totalSpent / totalPounds : 0;

    const totalAbonos = payments.reduce((acc, item) => acc + Number(item.amount), 0);
    const totalPending = Math.max(totalSales - totalAbonos, 0);

    return {
      totalPounds,
      totalSpent,
      totalSales,
      totalProfit,
      avgCostPerPound,
      totalAbonos,
      totalPending,
    };
  }, [records, payments, pricePerPound]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addRecord = (e) => {
    e.preventDefault();

    if (!form.date || !form.pounds || !form.totalCost) {
      alert("Completa fecha, libras y costo total.");
      return;
    }

    const pounds = Number(form.pounds);
    const totalCost = Number(form.totalCost);

    if (pounds <= 0 || totalCost <= 0) {
      alert("Las libras y el costo deben ser mayores a 0.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      date: form.date,
      pounds,
      totalCost,
      notes: form.notes,
    };

    setRecords((prev) => [newRecord, ...prev]);

    setForm({
      date: new Date().toISOString().split("T")[0],
      pounds: "",
      totalCost: "",
      notes: "",
    });
  };

  const addPayment = (e) => {
    e.preventDefault();

    if (!paymentForm.date || !paymentForm.amount) {
      alert("Completa fecha y monto del abono.");
      return;
    }

    const amount = Number(paymentForm.amount);

    if (amount <= 0) {
      alert("El abono debe ser mayor a 0.");
      return;
    }

    const newPayment = {
      id: Date.now() + Math.random(),
      date: paymentForm.date,
      amount,
      notes: paymentForm.notes,
    };

    setPayments((prev) => [newPayment, ...prev]);

    setPaymentForm({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      notes: "",
    });
  };

  const deleteRecord = (id) => {
    const confirmDelete = window.confirm("¿Deseas eliminar este registro?");
    if (!confirmDelete) return;
    setRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const deletePayment = (id) => {
    const confirmDelete = window.confirm("¿Deseas eliminar este abono?");
    if (!confirmDelete) return;
    setPayments((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    const confirmClear = window.confirm("¿Seguro que deseas borrar todos los registros y abonos?");
    if (!confirmClear) return;
    setRecords([]);
    setPayments([]);
  };

  return (
    <div className="container">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { font-family: Arial, Helvetica, sans-serif; color: #1f2937; background: #f3f4f6; }
        body { min-height: 100vh; background: linear-gradient(135deg, #f8fafc, #e5e7eb); }
        button, input { font: inherit; }
        .container { max-width: 1280px; margin: 0 auto; padding: 30px 16px 60px; }
        .hero { margin-bottom: 24px; }
        .hero h1 { font-size: 2.2rem; margin-bottom: 8px; color: #111827; }
        .hero p { color: #4b5563; font-size: 1rem; }
        .top-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .card { background: #ffffff; border-radius: 18px; padding: 20px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06); }
        .form-card h2, .table-card h2 { margin-bottom: 16px; color: #111827; }
        .form { display: grid; gap: 14px; }
        .field { display: grid; gap: 6px; }
        .field label { font-size: 0.95rem; font-weight: 600; }
        .field input { padding: 12px 14px; border: 1px solid #d1d5db; border-radius: 12px; outline: none; transition: 0.2s ease; background: #fff; }
        .field input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); }
        .btn-primary, .btn-secondary, .icon-btn { border: none; cursor: pointer; transition: 0.2s ease; }
        .btn-primary { background: #2563eb; color: white; padding: 13px 16px; border-radius: 12px; font-weight: bold; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-secondary { background: #ef4444; color: white; padding: 10px 14px; border-radius: 10px; font-weight: 600; }
        .btn-secondary:hover { background: #dc2626; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card, .summary-card { background: white; border-radius: 18px; padding: 18px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06); }
        .stat-card { display: flex; align-items: center; gap: 14px; }
        .stat-card span { display: block; color: #6b7280; margin-bottom: 4px; }
        .stat-card strong { font-size: 1.2rem; }
        .stat-icon { background: #eff6ff; color: #2563eb; border-radius: 14px; padding: 12px; display: flex; align-items: center; justify-content: center; }
        .summary-card { grid-column: 1 / -1; display: grid; gap: 10px; }
        .profit { color: #16a34a; font-weight: bold; }
        .loss { color: #dc2626; font-weight: bold; }
        .tables-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; }
        .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .table-wrapper { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #f9fafb; }
        th, td { text-align: left; padding: 14px 12px; border-bottom: 1px solid #e5e7eb; font-size: 0.95rem; }
        th { color: #374151; }
        .icon-btn { background: #fee2e2; color: #b91c1c; border-radius: 10px; padding: 8px; display: inline-flex; align-items: center; justify-content: center; }
        .icon-btn:hover { background: #fecaca; }
        .empty { text-align: center; padding: 30px; color: #6b7280; border: 2px dashed #d1d5db; border-radius: 14px; }
        @media (max-width: 1000px) {
          .top-grid, .tables-grid { grid-template-columns: 1fr; }
          .stats { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className="hero">
        <h1>Registro de Lomos y Abonos</h1>
        <p>
          Controla compras, ventas estimadas, pagos recibidos y el dinero pendiente del negocio.
        </p>
      </header>

      <section className="top-grid">
        <div className="card form-card">
          <h2>Agregar compra</h2>
          <form onSubmit={addRecord} className="form">
            <div className="field">
              <label>Fecha</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Libras compradas</label>
              <input type="number" name="pounds" min="0" step="0.01" placeholder="Ej. 25" value={form.pounds} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Costo total</label>
              <input type="number" name="totalCost" min="0" step="0.01" placeholder="Ej. 55" value={form.totalCost} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Notas</label>
              <input type="text" name="notes" placeholder="Ej. Compra del sábado" value={form.notes} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Precio de venta por libra</label>
              <input type="number" min="0" step="0.01" value={pricePerPound} onChange={(e) => setPricePerPound(Number(e.target.value))} />
            </div>

            <button type="submit" className="btn-primary">Guardar compra</button>
          </form>
        </div>

        <div className="card form-card">
          <h2>Agregar abono</h2>
          <form onSubmit={addPayment} className="form">
            <div className="field">
              <label>Fecha del abono</label>
              <input type="date" name="date" value={paymentForm.date} onChange={handlePaymentChange} />
            </div>

            <div className="field">
              <label>Monto abonado</label>
              <input type="number" name="amount" min="0" step="0.01" placeholder="Ej. 20" value={paymentForm.amount} onChange={handlePaymentChange} />
            </div>

            <div className="field">
              <label>Detalle</label>
              <input type="text" name="notes" placeholder="Ej. Abono del cliente Juan" value={paymentForm.notes} onChange={handlePaymentChange} />
            </div>

            <button type="submit" className="btn-primary">Guardar abono</button>
          </form>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <div className="stat-icon"><Scale size={20} /></div>
          <div>
            <span>Total libras</span>
            <strong>{totals.totalPounds.toFixed(2)}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><DollarSign size={20} /></div>
          <div>
            <span>Total invertido</span>
            <strong>{formatMoney(totals.totalSpent)}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Package size={20} /></div>
          <div>
            <span>Dinero total</span>
            <strong>{formatMoney(totals.totalSales)}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Receipt size={20} /></div>
          <div>
            <span>Total abonado</span>
            <strong>{formatMoney(totals.totalAbonos)}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><Wallet size={20} /></div>
          <div>
            <span>Dinero pendiente</span>
            <strong className={totals.totalPending > 0 ? "loss" : "profit"}>
              {formatMoney(totals.totalPending)}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><DollarSign size={20} /></div>
          <div>
            <span>Ganancia estimada</span>
            <strong className={totals.totalProfit >= 0 ? "profit" : "loss"}>
              {formatMoney(totals.totalProfit)}
            </strong>
          </div>
        </div>

        <div className="summary-card">
          <p><strong>Costo promedio por libra:</strong> {formatMoney(totals.avgCostPerPound)}</p>
          <p><strong>Precio de venta por libra:</strong> {formatMoney(pricePerPound)}</p>
          <p><strong>Compras registradas:</strong> {records.length}</p>
          <p><strong>Abonos registrados:</strong> {payments.length}</p>
        </div>
      </section>

      <section className="tables-grid">
        <div className="card table-card">
          <div className="table-header">
            <h2>Historial de compras</h2>
            <button onClick={clearAll} className="btn-secondary">Borrar todo</button>
          </div>

          {records.length === 0 ? (
            <div className="empty">No hay compras registradas todavía.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Libras</th>
                    <th>Costo total</th>
                    <th>Costo por libra</th>
                    <th>Venta estimada</th>
                    <th>Ganancia</th>
                    <th>Notas</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item) => {
                    const costPerPound = Number(item.totalCost) / Number(item.pounds);
                    const estimatedSale = Number(item.pounds) * Number(pricePerPound);
                    const estimatedProfit = estimatedSale - Number(item.totalCost);

                    return (
                      <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>{Number(item.pounds).toFixed(2)}</td>
                        <td>{formatMoney(item.totalCost)}</td>
                        <td>{formatMoney(costPerPound)}</td>
                        <td>{formatMoney(estimatedSale)}</td>
                        <td className={estimatedProfit >= 0 ? "profit" : "loss"}>{formatMoney(estimatedProfit)}</td>
                        <td>{item.notes || "-"}</td>
                        <td>
                          <button className="icon-btn" onClick={() => deleteRecord(item.id)}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card table-card">
          <div className="table-header">
            <h2>Historial de abonos</h2>
          </div>

          {payments.length === 0 ? (
            <div className="empty">No hay abonos registrados todavía.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Detalle</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td>{formatMoney(item.amount)}</td>
                      <td>{item.notes || "-"}</td>
                      <td>
                        <button className="icon-btn" onClick={() => deletePayment(item.id)}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
