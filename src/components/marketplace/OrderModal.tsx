import React, { useState } from 'react';
import { ProduceListing, Order } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { storage } from '../../lib/storage';
import { orderFormSchema } from '../../lib/validation';
import { useAuth } from '../../lib/auth';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Truck,
  TrendingUp,
  User,
  Phone,
} from 'lucide-react';
import { COASTAL_TALUKS } from '../../data/coastalLocations';

interface OrderModalProps {
  produce: ProduceListing | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  produce,
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  if (!isOpen || !produce) return null;

  const { currentUser } = useAuth();
  const [quantity, setQuantity] = useState<number>(produce.min_order_qty);
  const [buyerName, setBuyerName] = useState(
    currentUser.role === 'buyer' ? currentUser.name : 'Ashweej'
  );
  const [buyerPhone, setBuyerPhone] = useState(
    currentUser.role === 'buyer' ? currentUser.phone : '9845998877'
  );
  const [buyerType, setBuyerType] = useState<Order['buyer_type']>(
    currentUser.buyer_type || 'restaurant'
  );
  const [deliveryType, setDeliveryType] = useState<Order['delivery_type']>('direct_delivery');
  const [deliveryTaluk, setDeliveryTaluk] = useState<Order['delivery_taluk']>(produce.taluk);
  const [deliveryAddress, setDeliveryAddress] = useState('Lighthouse Hill Road, Hampankatta, Mangalore');
  const [paymentMethod, setPaymentMethod] = useState<Order['payment_method']>('upi_direct');
  const [notes, setNotes] = useState('Fresh morning harvest requested. Contact on arrival.');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial calculations
  const totalAmount = quantity * produce.farmer_price_per_unit;
  const farmerExtraEarned = Math.round(
    (produce.farmer_price_per_unit - produce.middleman_trader_price) * quantity
  );
  const buyerSaved = Math.round(
    (produce.retail_market_estimate - produce.farmer_price_per_unit) * quantity
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = orderFormSchema.safeParse({
      buyer_name: buyerName,
      buyer_phone: buyerPhone,
      buyer_type: buyerType,
      quantity,
      delivery_type: deliveryType,
      delivery_taluk: deliveryTaluk,
      delivery_address: deliveryAddress,
      payment_method: paymentMethod,
      notes,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = result.error.issues || [];
      issues.forEach((err: any) => {
        if (err.path && err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (quantity > produce.available_qty) {
      setErrors({ quantity: `Only ${produce.available_qty} ${produce.unit} available in stock.` });
      return;
    }

    if (quantity < produce.min_order_qty) {
      setErrors({ quantity: `Minimum order quantity is ${produce.min_order_qty} ${produce.unit}.` });
      return;
    }

    setIsSubmitting(true);

    try {
      const createdOrder = storage.createOrder({
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        buyer_type: buyerType,
        listing_id: produce.id,
        quantity,
        delivery_type: deliveryType,
        delivery_address: deliveryAddress,
        delivery_taluk: deliveryTaluk,
        payment_method: paymentMethod,
        notes,
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2D7A49', '#59BB7B', '#A7DFB8'],
        });
      } catch {}

      onOrderSuccess(createdOrder);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to place order';
      setErrors({ submit: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FAF7F0] rounded-lg border border-[#E5DFCE] shadow-xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0F2E1B] text-white">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#59BB7B]" />
            <div>
              <h3 className="text-sm font-bold">Direct Harvest Order</h3>
              <p className="text-[11px] text-[#A7DFB8]">
                Ordering from {produce.farmer_name} • Direct Producer Contract
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content & Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* 1. Item Summary */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-md border border-[#E5DFCE]">
            <img
              src={produce.photos[0]}
              alt={produce.crop_name}
              className="w-12 h-12 rounded object-cover border border-[#E5DFCE]"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-[#0F2E1B] truncate">
                {produce.crop_name}
              </h4>
              <p className="text-[11px] text-[#63675E] truncate">
                {produce.variety} • {produce.grade}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-xs">
                <span className="font-bold text-[#164327]">
                  {formatCurrency(produce.farmer_price_per_unit)}/{produce.unit}
                </span>
                <span className="text-[#84897E] text-[10px]">
                  (In Stock: {produce.available_qty} {produce.unit})
                </span>
              </div>
            </div>
          </div>

          {/* 2. Quantity Selection & Calculation */}
          <div className="bg-white p-3.5 rounded-md border border-[#E5DFCE] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-[#1C1D1A]">
                  Order Quantity ({produce.unit}):
                </label>
                <span className="text-[10px] text-[#84897E] block">
                  Minimum: {produce.min_order_qty} {produce.unit}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(produce.min_order_qty, quantity - 5))}
                  className="h-8 w-8 rounded bg-[#F2EEE2] hover:bg-[#E5DFCE] text-[#0F2E1B] font-bold text-sm flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min={produce.min_order_qty}
                  max={produce.available_qty}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || produce.min_order_qty)}
                  className="h-8 w-16 text-center text-xs font-bold bg-[#FAF7F0] border border-[#E5DFCE] rounded focus:outline-none focus:ring-1 focus:ring-[#2D7A49]"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(produce.available_qty, quantity + 5))}
                  className="h-8 w-8 rounded bg-[#F2EEE2] hover:bg-[#E5DFCE] text-[#0F2E1B] font-bold text-sm flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            {errors.quantity && <p className="text-[10px] text-red-600">{errors.quantity}</p>}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5DFCE]">
              <div className="p-2 rounded bg-[#FAF7F0] border border-[#E5DFCE]">
                <span className="text-[10px] text-[#84897E] block font-medium">Total Amount</span>
                <span className="text-base font-bold text-[#164327]">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="p-2 rounded bg-[#E2F6EB] border border-[#2D7A49]/30">
                <span className="text-[10px] text-[#164327] block font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#2D7A49]" />
                  Farmer Direct Gain
                </span>
                <span className="text-base font-bold text-[#164327]">
                  +{formatCurrency(farmerExtraEarned)}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Buyer Details */}
          <div className="bg-white p-3.5 rounded-md border border-[#E5DFCE] space-y-2.5">
            <h5 className="text-xs font-bold text-[#1C1D1A]">
              Delivery & Buyer Details
            </h5>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#63675E] block mb-0.5">Name</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full h-8 px-2.5 rounded bg-[#FAF7F0] border border-[#E5DFCE] text-xs focus:outline-none focus:ring-1 focus:ring-[#2D7A49]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#63675E] block mb-0.5">Phone</label>
                <input
                  type="text"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full h-8 px-2.5 rounded bg-[#FAF7F0] border border-[#E5DFCE] text-xs focus:outline-none focus:ring-1 focus:ring-[#2D7A49]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#63675E] block mb-0.5">Taluk</label>
                <select
                  value={deliveryTaluk}
                  onChange={(e) => setDeliveryTaluk(e.target.value as Order['delivery_taluk'])}
                  className="w-full h-8 px-2 rounded bg-[#FAF7F0] border border-[#E5DFCE] text-xs focus:outline-none focus:ring-1 focus:ring-[#2D7A49]"
                >
                  {COASTAL_TALUKS.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#63675E] block mb-0.5">Logistics Mode</label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value as Order['delivery_type'])}
                  className="w-full h-8 px-2 rounded bg-[#FAF7F0] border border-[#E5DFCE] text-xs focus:outline-none focus:ring-1 focus:ring-[#2D7A49]"
                >
                  <option value="direct_delivery">Direct Van Delivery</option>
                  <option value="hub_consolidation">District Hub Consolidation</option>
                  <option value="farm_pickup">Farm-Gate Pickup</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#63675E] block mb-0.5">Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Street name, landmark, town"
                className="w-full h-8 px-2.5 rounded bg-[#FAF7F0] border border-[#E5DFCE] text-xs focus:outline-none focus:ring-1 focus:ring-[#2D7A49]"
              />
            </div>
          </div>

          {/* 4. Payment Preference */}
          <div className="bg-white p-3.5 rounded-md border border-[#E5DFCE] space-y-1.5">
            <h5 className="text-xs font-bold text-[#1C1D1A]">Payment Preference</h5>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <label
                className={`flex items-center gap-1.5 p-2 rounded border cursor-pointer ${
                  paymentMethod === 'upi_direct'
                    ? 'border-[#2D7A49] bg-[#E2F6EB] text-[#0F2E1B]'
                    : 'border-[#E5DFCE] bg-[#FAF7F0] text-[#63675E]'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'upi_direct'}
                  onChange={() => setPaymentMethod('upi_direct')}
                />
                <span>UPI Direct</span>
              </label>

              <label
                className={`flex items-center gap-1.5 p-2 rounded border cursor-pointer ${
                  paymentMethod === 'escrow_hold'
                    ? 'border-[#2D7A49] bg-[#E2F6EB] text-[#0F2E1B]'
                    : 'border-[#E5DFCE] bg-[#FAF7F0] text-[#63675E]'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'escrow_hold'}
                  onChange={() => setPaymentMethod('escrow_hold')}
                />
                <span>Escrow</span>
              </label>

              <label
                className={`flex items-center gap-1.5 p-2 rounded border cursor-pointer ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#2D7A49] bg-[#E2F6EB] text-[#0F2E1B]'
                    : 'border-[#E5DFCE] bg-[#FAF7F0] text-[#63675E]'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          {errors.submit && (
            <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200">
              {errors.submit}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-md border border-[#E5DFCE] text-xs font-semibold text-[#63675E] hover:bg-[#F2EEE2]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 flex items-center gap-1.5 px-5 rounded-md bg-[#164327] hover:bg-[#0F2E1B] text-white text-xs font-bold transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-[#59BB7B]" />
              <span>{isSubmitting ? 'Confirming...' : `Confirm Order (${formatCurrency(totalAmount)})`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
