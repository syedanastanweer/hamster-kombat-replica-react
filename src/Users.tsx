import React, { useState, useEffect } from 'react';

const Users: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  return (
    <div className="bg-black text-white h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">All Users</h1>
        <ul>
          {users.map((user, index) => (
            <li key={index} className="text-lg">{user}</li>
          ))}
        </ul>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Users;
