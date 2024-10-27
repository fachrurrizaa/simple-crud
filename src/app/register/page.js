'use client'
import Image from 'next/image';
import hero from '../../../public/assets/loginimg.png';
import Input from '@/components/form/Input';
import Button from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';
import { z } from 'zod';

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState({ username: "", password: "", email: "", nama: "" });
  const [errors, setErrors] = useState({});
  const MySwal = withReactContent(Swal);

  // Schema validasi Zod
  const registerSchema = z.object({
    username: z.string().min(3, "Username harus memiliki minimal 3 karakter"),
    password: z.string().min(8, "Password harus memiliki minimal 8 karakter"),
    email: z.string().email("Email tidak valid"),
    nama: z.string().min(3, "Nama harus memiliki minimal 3 karakter"),
  });

  async function handleSubmit(e) {
    e.preventDefault();

    // Validasi input menggunakan Zod
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      // Jika validasi gagal, simpan pesan error dari Zod ke state errors
      const errorMessages = result.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }

    // Mengirim data jika validasi berhasil
    try {
      const res = await axios.post('/api/user', data);
      if (res.status === 201) {
        MySwal.fire({
          title: 'Success',
          text: 'User created successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }

  return (
    <form className="bg-white h-screen w-screen flex items-center mx-11" onSubmit={handleSubmit}>
      <div className="w-2/4 h-auto ml-20">
        <Image src={hero} width={700} height={700} alt={"logo"} />
      </div>
      <div className="w-2/6 h-[80%] rounded-2xl outline outline-1 outline-neutral-400 ml-20 flex flex-col justify-center">
        <div className="mb-7">
          <h1 className="font-bold text-2xl text-[#6D0245] text-center">Register</h1>
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

          <Input
            type="email"
            label="Email"
            placeholder="Type your Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}

          <Input
            type="text"
            label="Name"
            placeholder="Type your Name"
            value={data.nama}
            onChange={(e) => setData({ ...data, nama: e.target.value })}
            className={errors.nama ? "border-red-500" : ""}
          />
          {errors.nama && <p className="text-red-500 mt-1">{errors.nama}</p>}

          <Button content="Register" className="w-[80%] rounded-md bg-[#01B7BF] text-white mt-5" />
        </div>
        <Link href="/" className="label-text font-semibold text-[#004f4f] text-base px-2 underline ml-11 mt-5">
          Already have an account?
        </Link>
      </div>
    </form>
  );
}
