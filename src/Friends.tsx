import React, { useState, useEffect } from 'react';

const FriendsPage: React.FC = () => {
  const [referrer, setReferrer] = useState<string | null>(null);

  useEffect(() => {
    const referrerSlug = localStorage.getItem('referrer');
    if (referrerSlug) {
      setReferrer(referrerSlug);
    }
  }, []);

  return (
    <div className="bg-black text-white h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Your Referrer</h1>
        {referrer ? (
          <p className="text-lg">You were referred by: {referrer}</p>
        ) : (
          <p className="text-lg">No referrer found.</p>
        )}
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

export default FriendsPage;
