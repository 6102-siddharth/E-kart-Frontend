import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../firebaseConfig'; // Adjust path

const getAuthToken = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        return await currentUser.getIdToken();
    }
    return null;
};

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`;

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const token = await getAuthToken();
            if (!token) {
                setError("Authentication required.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await axios.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
                setError('');
            } catch (err) {
                setError("Failed to load users. " + (err.response?.data?.message || err.message));
                console.error("Error fetching users:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) return <p className="text-gray-600">Loading users...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h1>
            
            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User ID</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Display Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{user.id.substring(0,10)}...</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{user.displayName || 'N/A'}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.isAdmin ? 'Admin' : 'User'}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsers;