import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Input from './Input';
import Button from '../Button';
import axios from 'axios';

export default function UserForm({ id, username, password, email, nama }) {
    const router = useRouter();
    const [usernameState, setUsername] = useState(username || '');
    const [passwordState, setPassword] = useState(password || '');
    const [emailState, setEmail] = useState(email || '');
    const [namaState, setNama] = useState(nama || '');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set initial state from props when component mounts
        setUsername(username || '');
        setPassword(password || '');
        setEmail(email || '');
        setNama(nama || '');
        setIsLoading(false);
    }, [username, password, email, nama]);

    async function handleSubmit(e) {
        e.preventDefault();
        const data = {
            username: usernameState,
            password: passwordState,
            email: emailState,
            nama: namaState,
        };

        try {
            if (id) {
                // Update existing user
                await axios.put(`/api/user?id=${id}`, data);
            } else {
                // Create new user
                await axios.post('/api/user', data);
            }
            // Redirect to dashboard after saving
            router.push('/dashboard');
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
        }
    }

    return (
        <div className="w-screen h-screen bg-[#F35782] flex flex-col justify-center items-center">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="w-[25%] h-[75%] rounded-2xl outline outline-1 outline-neutral-400 ml-20 flex flex-col">
                    <div className="mb-7 ml-12 mt-12">
                        <h1 className="font-bold text-2xl text-[#6D0245]">Edit User</h1>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center">
                        <Input
                            type="text"
                            label="Username"
                            value={usernameState}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            type="password"
                            label="Password"
                            value={passwordState}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Input
                            type="email"
                            label="Email"
                            value={emailState}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="text"
                            label="Nama"
                            value={namaState}
                            onChange={(e) => setNama(e.target.value)}
                        />
                    </div>
                    <div className='ml-12 mt-7'>
                        <Button
                            type="submit"
                            content="Simpan"
                            className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 mr-10 rounded-sm"
                            click={handleSubmit}
                        />
                        <Link href={'/dashboard'} className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-[13px] px-6 rounded mr-10'>
                            Kembali
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
