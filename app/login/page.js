"use client";

import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const Login = () => {
  const titleClass =
    "uppercase hd:text-2xl fhd:text-4xl font-bold text-white flex justify-center";

  return (
    <>
      <div className="absolute z-[10] w-full h-full flex items-center justify-center">
        <div className="hd:w-[60vw] h-[65vh] fhd:w-[70vw] w-[60vw] bg-white rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.25)] overflow-hidden">
          <div className="relative hd:w-[33vw] h-[65vh] fhd:w-[39vw]">
            <Image
              src="/assets/login-card-bg.jpg"
              alt="Login card background image"
              className="object-cover"
              fill
              priority
            />
          </div>
        </div>
      </div>
      <div className="absolute z-[30] w-full h-full flex items-center justify-center">
        <div className="flex hd:w-[60vw] h-[65vh] fhd:w-[70vw] items-end justify-end py-4">
          <div className="flex flex-col mobile:w-[42vw] hd:w-[26vw] h-[58vh] fhd:w-[30vw] items-center justify-center">
            <div className="mobile:pt-6 hd:pt-6 fhd:pt-20">
              <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
