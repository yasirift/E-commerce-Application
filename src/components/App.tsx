import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { hydrateFromStorage } from "../features/auth/authSlice";
import AppRoutes from "../routes/routes";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);

  return <AppRoutes />;
}
