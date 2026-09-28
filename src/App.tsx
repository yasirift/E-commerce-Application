import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { hydrateFromStorage } from "./features/auth/authSlice";
import { fetchOrders } from "./features/orders/orderSlice";
import AppRoutes from "./routes/routes";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateFromStorage());
    dispatch(fetchOrders());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
