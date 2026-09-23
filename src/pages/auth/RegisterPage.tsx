import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../schemas/registerSchema";
import Input from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

export default function RegisterPage() {
  const {
    register: registerUser,
    registering,
    registerError,
    registerSucceeded,
    resetRegisterError,
  } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  useEffect(() => {
    resetRegisterError();
  }, [resetRegisterError]);

  useEffect(() => {
    if (registerSucceeded) {
      navigate("/login?registered=1", { replace: true });
    }
  }, [registerSucceeded, navigate]);

  async function onSubmit(values: RegisterFormValues) {
    await registerUser(values);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Create Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
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
          label="Username"
          error={errors.username?.message}
          {...register("username")}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm Password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {registerError && (
          <div className="rounded-md bg-danger-light px-3 py-2 text-sm text-danger">
            {registerError}
          </div>
        )}

        <Button type="submit" loading={registering} className="w-full">
          Create Account
        </Button>
      </form>
    </div>
  );
}
