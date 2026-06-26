export default function OrderSummary({ items = [], className = '' }) {
  const subtotal = items.reduce((sum, i) => sum + (i.price || i.unit_price) * i.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className={`bg-slate-50 rounded-xl p-4 space-y-3 ${className}`}>
      <h3 className="font-semibold text-slate-800">Order Summary</h3>
      <div className="space-y-2 text-sm">
        {items.map((item) => (
          <div key={item.product_id || item.id} className="flex justify-between text-slate-600">
            <span>{item.name || item.product_name} × {item.quantity}</span>
            <span>${((item.price || item.unit_price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-2 space-y-1 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-1 border-t">
          <span>Total</span>
          <span className="text-gold">${total.toFixed(2)}</span>
        </div>
      </div>
      {subtotal < 50 && (
        <p className="text-xs text-slate-500">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
      )}
    </div>
  );
}
