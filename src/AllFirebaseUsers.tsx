import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const AllFirebaseUsers: React.FC = () => {
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as { id: string; name: string }[];
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-black text-white p-4">
      <h1 className="text-2xl mb-4">Firebase Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AllFirebaseUsers;
