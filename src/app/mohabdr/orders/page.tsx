"use client";
import { useState, useEffect } from "react";
import { paymentMethodLabels, formatPrice } from "@/lib/validation";

interface OrderItem { productId: string; productName: string; quantity: number; price: string; }
interface Order { id: string; orderNumber: string; status: string; paymentMethod: string; paymentStatus: string; subtotal: string; deliveryFee: string; total: string; customer?: { name: string; email: string; phone?: string; wilaya?: string; city?: string; address?: string }; items?: OrderItem[]; createdAt: string; }

const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
const payStatuses = ["Pending", "Paid", "Failed", "Refunded"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders").then(r => r.ok ? r.json() : []).then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, field: string, value: string) => {
    await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: value }) });
    setOrders(orders.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-xl font-bold tracking-wider uppercase mb-6">Orders</h1>
      {orders.length === 0 ? <p className="text-white/30 py-12 text-center">No orders yet</p> : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="bg-white/5 border border-white/5 rounded-lg">
              <div className="p-4 cursor-pointer hover:bg-white/5" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm">{o.orderNumber}</p>
                    <p className="text-xs text-white/50 mt-1">{o.customer?.name} — {o.customer?.email}</p>
                    <p className="text-xs text-white/30">{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <select value={o.status} onChange={e => updateStatus(o.id, "status", e.target.value)} onClick={e => e.stopPropagation()} className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-white focus:outline-none">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={o.paymentStatus} onChange={e => updateStatus(o.id, "paymentStatus", e.target.value)} onClick={e => e.stopPropagation()} className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-white focus:outline-none">
                      {payStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="text-sm font-semibold">{formatPrice(o.total)}</span>
                  </div>
                </div>
              </div>
              {expanded === o.id && (
                <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slideDown">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                    <div><p className="text-xs text-white/40">Payment</p><p>{paymentMethodLabels[o.paymentMethod] || o.paymentMethod}</p></div>
                    <div><p className="text-xs text-white/40">Phone</p><p>{o.customer?.phone || "—"}</p></div>
                    <div><p className="text-xs text-white/40">Wilaya</p><p>{o.customer?.wilaya || "—"}</p></div>
                    <div><p className="text-xs text-white/40">City</p><p>{o.customer?.city || "—"}</p></div>
                  </div>
                  {o.customer?.address && <p className="text-sm mb-3"><span className="text-xs text-white/40">Address: </span>{o.customer.address}</p>}
                  <div className="space-y-2">
                    {o.items?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm bg-white/5 px-3 py-2 rounded">
                        <span>{item.productName} × {item.quantity}</span>
                        <span>{formatPrice(item.price)} each</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-white/40">Subtotal</span><span>{formatPrice(o.subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Delivery</span><span>{formatPrice(o.deliveryFee)}</span></div>
                    <div className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(o.total)}</span></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
