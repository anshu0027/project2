'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    currency: string;
    status: number;
}

export default function TransactionForm() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [amount, setAmount] = useState('');
    const [paymethod, setPaymethod] = useState('cash');
    const [status, setStatus] = useState('1');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get('http://localhost:3001/api/showcase');
            const activeUsers = res.data.filter((u: { status: string }) => u.status === 'Active');
            setUsers(activeUsers.map((u: { id: number; name: string; deposit: string; status: string }) => ({
                id: u.id,
                name: u.name,
                currency: u.deposit.split(' ')[1],
                status: u.status === 'Active' ? 1 : 0
            })));
        };
        fetchUsers();
    }, []);

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const user = users.find(u => u.id === parseInt(e.target.value));
        setSelectedUser(user || null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return setMessage('Please select a valid user.');

        try {
            const res = await axios.post('http://localhost:3001/api/transaction', {
                user_id: selectedUser.id,
                amount: parseFloat(amount),
                paymethod,
                status: parseInt(status)
            });

            if (res.data.success) {
                setMessage(`Transaction added successfully${res.data.penalty ? ` with penalty of ${res.data.penalty}` : ''}`);
                setAmount('');
                setPaymethod('cash');
                setStatus('1');
                setSelectedUser(null);
            }
        } catch (err: unknown) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error
                ? err.response.data.error
                : 'Error while adding transaction.';
            setMessage(errorMessage);
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                setMessage(err.response.data.error);
            } else {
                setMessage('Error while adding transaction.');
            }
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Add Transaction</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select onChange={handleUserChange} className="w-full p-2 border rounded" required>
                    <option value="">Select User</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>

                <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded" required />

                <input type="text" value={selectedUser?.currency || ''} disabled className="w-full p-2 border rounded bg-gray-100 text-gray-600" />

                <select value={paymethod} onChange={e => setPaymethod(e.target.value)} className="w-full p-2 border rounded">
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="online">Online</option>
                </select>

                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2 border rounded">
                    <option value="1">Success</option>
                    <option value="0">Pending</option>
                </select>

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add Transaction</button>
            </form>
            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        </div>
    );
}
