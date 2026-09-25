import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCart } from "../../hooks/useCart";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "../../schemas/checkoutSchema";
import {
  createOrder,
  selectCreateOrderError,
  selectCreateOrderStatus,
  clearCreateError,
} from "../../features/orders/orderSlice";
import Input from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

export default function Checkout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, subtotal, discount, shipping, total, isEmpty, clear } =
    useCart();
  const status = useAppSelector(selectCreateOrderStatus);
  const error = useAppSelector(selectCreateOrderError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    dispatch(clearCreateError());
  }, [dispatch]);

  if (isEmpty) {
    return <Navigate to="/products" replace />;
  }

  async function onSubmit(values: CheckoutFormValues) {
    const result = await dispatch(
      createOrder({
        customer: values,
        items,
        subtotal,
        discount,
        shipping,
        total,
      }),
    );
    if (createOrder.fulfilled.match(result)) {
      clear();
      navigate(`/orders/${result.payload.id}`, { replace: true });
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[1fr_320px]">
      <div>
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              label="Last Name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Phone"
            type="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Address"
            error={errors.address?.message}
            {...register("address")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              error={errors.city?.message}
              {...register("city")}
            />
            <Input
              label="Country"
              error={errors.country?.message}
              {...register("country")}
            />
          </div>
          <Input
            label="Postal Code"
            error={errors.postalCode?.message}
            {...register("postalCode")}
          />

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            loading={status === "loading"}
            className="w-full"
          >
            Place Order
          </Button>
        </form>
      </div>

      <aside className="h-fit rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">
          Order Summary
        </h2>
        <ul className="mb-3 max-h-64 space-y-2 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="line-clamp-1 text-gray-600">
                {item.title} × {item.quantity}
              </span>
              <span className="font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-gray-200 pt-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span className="text-green-600">-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1.5 text-base font-bold text-gray-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
