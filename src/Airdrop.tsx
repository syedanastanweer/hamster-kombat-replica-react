import React from 'react';
import { useNavigate } from 'react-router-dom';

const AirdropPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Airdrop</h1>
        <p>Currently, there are no airdrops available. We will notify you when updates are available.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AirdropPage;
