'use client';

import { useState } from 'react';
import axios from 'axios';

export default function UserDataForm() {
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        description: '',
        deposit: '',
        total_confirmed_amount: '',
        currency: 'INR',
        status: '1',
        due_date: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/api/user', {
                ...formData,
                deposit: parseFloat(formData.deposit),
                total_confirmed_amount: parseFloat(formData.total_confirmed_amount),
                status: parseInt(formData.status)
            });
            if (res.data.success) {
                setMessage('User added successfully!');
                setFormData({
                    fname: '', lname: '', description: '', deposit: '', total_confirmed_amount: '', currency: 'INR', status: '1', due_date: ''
                });
            }
        } catch (err: unknown) {
            console.error(err);
            setMessage('Error adding user.');
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Add New User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="fname" placeholder="First Name" value={formData.fname} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="lname" placeholder="Last Name" value={formData.lname} onChange={handleChange} className="w-full p-2 border rounded" required />
                <textarea name="description" placeholder="Introduction" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="deposit" type="number" placeholder="Deposit" value={formData.deposit} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="total_confirmed_amount" type="number" placeholder="Total Confirmed Amount" value={formData.total_confirmed_amount} onChange={handleChange} className="w-full p-2 border rounded" required />

                <select name="currency" value={formData.currency} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="AUD">AUD</option>
                </select>

                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                </select>

                <input name="due_date" type="date" value={formData.due_date} onChange={handleChange} className="w-full p-2 border rounded" required />

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
            </form>
            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        </div>
    );
}
