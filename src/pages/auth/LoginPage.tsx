import { useForm } from "react-hook-form";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../../schemas/loginSchema";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/InputField";

export default function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "emilys", password: "emilyspass" },
  });

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/dashboard";
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  async function onSubmit(values: LoginFormValues) {
    await login(values);
  }

  const justRegistered = searchParams.get("registered") === "1";

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Log In</h1>

      {justRegistered && (
        <div className="mt-4 rounded-md bg-primary-light px-3 py-2 text-sm text-primary-dark">
          Account Created Use the demo credential below to log in
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
        <Input
          label="Username"
          type="text"
          autoComplete="username"
          error={errors.username?.message}
          {...register("username")}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {error && (
          <div className="rounded-md bg-danger-light px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Log In
        </Button>

        <p className="text-center text-xs text-muted">
          Demo credentials: <span className="font-mono text-ink">emilys</span> /{" "}
          <span className="font-mono text-ink">emilyspass</span>
        </p>
        <p className="text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:text-primary-dark">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
