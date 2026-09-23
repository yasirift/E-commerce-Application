import { useAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-ink">
        Welcome{user ? `, ${user.firstName}` : ""}
      </h1>
    </div>
  );
}
