"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const router = useRouter();
  const loginState = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login, isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    setValue("username", "admin");
    setValue("password", "admin123");
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (returnTo) {
        window.location.href = returnTo;
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, returnTo, router]);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      await loginState(data.username, data.password);

      toastWithProgress({
        title: "Berhasil",
        description: "Login sukses.",
        duration: 3000,
        type: "success",
      });

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Username atau password salah.");
      toastWithProgress({
        title: "Gagal",
        description: "Login gagal.",
        duration: 3000,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mobile:space-y-2 hd:space-y-2 fhd:space-y-4"
    >
      <div className="relative">
        <Input
          id="username"
          placeholder="Username"
          {...register("username")}
          aria-invalid={!!errors.username}
          className="peer pl-10 bg-primary-3 mobile:w-[48vw] hd:w-[19vw] hd:h-[7vh] fhd:w-[24vw] fhd:h-[6vh] mobile:text-xs border border-2 border-stone-300 rounded-full"
        />
        <div className="absolute left-3 mobile:top-3 hd:top-3 fhd:top-5 text-gray-500 transition-transform duration-300 ease-in-out fhd:peer-focus:translate-x-98 hd:peer-focus:translate-x-52">
          <Icon icon="lucide:user" className="hd:text-lg fhd:text-3xl" />
        </div>
        {errors.username && (
          <p className="text-red-500 text-start text-xs fhd:text-2xl pl-2 mt-1">
            {errors.username.message}
          </p>
        )}
      </div>
      <div className="relative mobile:pb-4 hd:pb-4 fhd:pb-8">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password")}
          aria-invalid={!!errors.password}
          className="peer pl-10 bg-primary-3 mobile:w-[48vw] hd:w-[19vw] hd:h-[7vh] fhd:w-[24vw] fhd:h-[6vh] mobile:text-xs border border-2 border-stone-300 rounded-full"
        />
        <div className="absolute left-3 mobile:top-3 hd:top-3 fhd:top-5 text-gray-500 transition-transform duration-300 ease-in-out fhd:peer-focus:translate-x-90 hd:peer-focus:translate-x-46">
          <Icon icon="bx:lock-alt" className="hd:text-lg fhd:text-3xl" />
        </div>
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute mobile:right-3 hd:right-3 fhd:right-6 mobile:top-3 hd:top-3 fhd:top-5 text-gray-500"
          tabIndex={-1}
        >
          <Icon
            icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
            className="hd:text-lg fhd:text-3xl"
          />
        </button>
        {errors.password && (
          <p className="text-red-500 text-start text-xs fhd:text-2xl mt-1 pl-2">
            {errors.password.message}
          </p>
        )}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-center text-sm mt-2">{errorMessage}</p>
      )}

      <div className="flex justify-center">
        <Button
          type="submit"
          variant="radial"
          disabled={loading}
          className="mobile:w-[20vw] hd:w-[8vw] fhd:w-[10vw] fhd:h-[6vh]"
        >
          <span className="mobile:text-xs hd:text-md fhd:text-2xl font-bold text-white">
            {loading ? "Memproses..." : "LOGIN"}
          </span>
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
