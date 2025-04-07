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
    total: string;
    status: string;
    payment_status: string;
}

export default function DataShowcase() {
    const [users, setUsers] = useState<UserShowcase[]>([]);
    const router = useRouter();

    const fetchData = async () => {
        const res = await axios.get('http://localhost:3001/api/showcase');
        setUsers(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteUser = async (id: number) => {
        if (confirm('Are you sure you want to delete this user and all their transactions?')) {
            await axios.delete(`http://localhost:3001/api/user/${id}`);
            fetchData();
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">User and Transaction Data</h1>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr className="text-left">
                            <th className="p-3 border border-gray-300 font-semibold text-gray-700">Name</th>
                            <th className="p-3 border border-gray-300 font-semibold text-gray-700">Introduction</th>
                            <th className="p-3 border border-gray-300 font-semibold text-gray-700">Paid</th>
                            <th className="p-3 border border-gray-300 font-semibold text-gray-700">Due</th>
                            <th className="p-3 border border-gray-300 font-semibold text-gray-700">Total Confirmed</th>
                            <th className="p-3 border border-gray-300 font-semibold text-gray-700">Status</th>
                            <th className="p-3 border border-gray-300 font-semibold text-gray-700">Payment Status</th>
                            <th className="p-3 border border-gray-300 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                                <td className="p-3 border border-gray-300 font-medium text-gray-800">
                                    {user.name}
                                    <div className="text-xs text-gray-500">ID: {user.user_id}</div>
                                </td>
                                <td className="p-3 border border-gray-300 text-gray-700">{user.intro}</td>
                                <td className="p-3 border border-gray-300 text-gray-700">{user.paid}</td>
                                <td className="p-3 border border-gray-300 text-gray-700">{user.due}</td>
                                <td className="p-3 border border-gray-300 text-gray-700">{user.total}</td>
                                <td className="p-3 border border-gray-300 text-gray-700">{user.status}</td>
                                <td className="p-3 border border-gray-300 text-gray-700">{user.payment_status}</td>
                                <td className="p-3 border border-gray-300 space-x-2">
                                    <button
                                        onClick={() => router.push(`/userdata?edit=${user.id}`)}
                                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => router.push(`/usertransaction?user=${user.id}`)}
                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                                    >
                                        Add Txn
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
