import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Friends: React.FC = () => {
  const [userList, setUserList] = useState<string[]>([]);
  const navigate = useNavigate();

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

  return (
    <div className="bg-black text-white h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Friends</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
        >
          Back
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

export default Friends;
