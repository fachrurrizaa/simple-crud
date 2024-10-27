'use client'
import Image from 'next/image';
import hero from '../../public/assets/loginimg.png';
import Input from '@/components/form/Input';
import Button from '@/components/Button';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import { z } from 'zod';

export default function Page() {
  const [data, setData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Schema validasi Zod untuk username dan password
  const loginSchema = z.object({
    username: z.string().min(3, "Username harus memiliki minimal 3 karakter"),
    password: z.string().min(8, "Password harus memiliki minimal 8 karakter"),
  });

  async function login() {
    // Validasi input menggunakan Zod
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      // Jika validasi gagal, simpan pesan error dari Zod ke state errors
      const errorMessages = result.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }

    // Jika validasi berhasil, lanjutkan ke proses sign in
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert(res.error || "Username atau password salah");
    }
  }

  return (
    <div className="bg-white h-screen w-screen flex items-center mx-11">
      <div className="w-2/4 h-auto ml-20">
        <Image src={hero} width={700} height={700} alt={"logo"} />
      </div>
      <div className="w-[25%] h-2/3 rounded-2xl outline outline-1 outline-neutral-400 ml-20 flex flex-col justify-center">
        <div className="mb-7">
          <h1 className="font-bold text-2xl text-[#6D0245] text-center">Welcome Back, Please Login to Your Account</h1>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <Input
            type="text"
            label="Username"
            placeholder="Type your username"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            className={errors.username ? "border-red-500" : ""}
          />
          {errors.username && <p className="text-red-500 mt-1">{errors.username}</p>}
          
          <Input
            type="password"
            label="Password"
            placeholder="Type your password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}

          <Button
            type="submit"
            content="Login"
            className="w-[80%] rounded-md bg-[#01B7BF] text-white mt-5"
            click={login}
          />
        </div>
        <Link href={'/register'} className="label-text font-semibold text-[#004f4f] text-base px-2 underline ml-11 mt-5">
          Don't have an account?
        </Link>
      </div>
    </div>
  );
}
