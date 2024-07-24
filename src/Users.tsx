import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Users: React.FC = () => {
  const [name, setName] = useState('');
  const [userList, setUserList] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/get-users`);
      if (response.ok) {
        const data = await response.json();
        setUserList(data.users);
      } else {
        alert('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (name.trim()) {
      const userId = uuidv4();
      const newUser = `${userId},${name.trim()}`;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/save-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: newUser }),
      });

      if (response.ok) {
        setUserList([...userList, newUser]);
        setName('');
      } else {
        alert('Failed to add user.');
      }
    }
  };

  return (
    <div className="bg-black text-white h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Add Users</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 rounded mb-4"
        />
        <button
          onClick={handleAddUser}
          className="mt-4 px-4 py-2 bg-white text-black rounded"
        >
          Add
        </button>
        <div className="mt-4">
          <h2 className="text-xl">User List</h2>
          {userList.map((user, index) => (
            <p key={index}>{user.split(',')[1]}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
