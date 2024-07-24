import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WalletConfig: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  const handleAddWallet = () => {
    setIsFetching(true);
    // Construct the deep link URL with a callback URL to your app
    const callbackUrl = `${window.location.origin}/wallet-callback`;
    const deepLinkUrl = `tonwallet://add_wallet?callback_url=${encodeURIComponent(callbackUrl)}`;
    window.location.href = deepLinkUrl;
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="bg-black text-white h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        {walletAddress ? (
          <>
            <p>Your TON wallet</p>
            <p>{walletAddress}</p>
          </>
        ) : (
          <>
            <button
              className="mt-4 px-4 py-2 bg-white text-black rounded"
              onClick={handleAddWallet}
              disabled={isFetching}
            >
              {isFetching ? 'Fetching...' : 'Add Your TON wallet'}
            </button>
          </>
        )}
        <button
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
          onClick={handleBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default WalletConfig;
