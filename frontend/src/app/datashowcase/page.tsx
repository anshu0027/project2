'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface UserShowcase {
    id: number;
    name: string;
    user_id: number;
    intro: string;
    deposit: string;
    paid: string;
    due: string;
    status: string;
    payment_status: string;
}

export default function DataShowcase() {
    const [users, setUsers] = useState<UserShowcase[]>([]);
    const router = useRouter();

    const fetchData = async () => {
        const res = await axios.get('/api/showcase');
        setUsers(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteUser = async (id: number) => {
        if (confirm('Are you sure you want to delete this user and all their transactions?')) {
            await axios.delete(`/api/user/${id}`);
            fetchData();
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">User and Transaction Data</h1>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Name</th>
                        <th className="p-2">Introduction</th>
                        <th className="p-2">Paid</th>
                        <th className="p-2">Due</th>
                        <th className="p-2">Deposit</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Payment Status</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-t">
                            <td className="p-2 font-semibold">
                                {user.name}
                                <div className="text-xs text-gray-500">ID: {user.user_id}</div>
                            </td>
                            <td className="p-2">{user.intro}</td>
                            <td className="p-2">{user.paid}</td>
                            <td className="p-2">{user.due}</td>
                            <td className="p-2">{user.deposit}</td>
                            <td className="p-2">{user.status}</td>
                            <td className="p-2">{user.payment_status}</td>
                            <td className="p-2 space-x-2">
                                <button
                                    onClick={() => router.push(`/userdata?edit=${user.id}`)}
                                    className="px-2 py-1 bg-blue-500 text-white rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => router.push(`/usertransaction?user=${user.id}`)}
                                    className="px-2 py-1 bg-green-600 text-white rounded"
                                >
                                    Add Txn
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
