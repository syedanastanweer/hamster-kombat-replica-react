import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WalletCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const walletAddress = queryParams.get('wallet_address');
    if (walletAddress) {
      localStorage.setItem('walletAddress', walletAddress);
    }
    // Redirect to wallet config page or wherever appropriate
    navigate('/wallet-config');
  }, [navigate]);

  return null;
};

export default WalletCallback;
