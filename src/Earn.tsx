// Earn.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { binanceLogo, hamsterCoin } from './images';
import Mine from './icons/Mine';
import Friends from './icons/Friends';
import Coins from './icons/Coins';

// Utility: create slug from string
const createSlug = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, '');
};

// Simulate user creation on page load (like after Firebase auth)
const createOrLoadUser = (referrerCode?: string) => {
  let users = JSON.parse(localStorage.getItem('users') || '[]');

  // Load current user by userName in localStorage or create new
  let currentUserName = localStorage.getItem('userName');
  if (!currentUserName) {
    // Generate random username (simulate signup)
    currentUserName = 'User' + Math.floor(Math.random() * 10000);
    localStorage.setItem('userName', currentUserName);
  }

  // Check if user exists
  let user = users.find((u: any) => u.name === currentUserName);
  if (!user) {
    // Create new user with referralCode and referrer
    const referralCode = createSlug(currentUserName);
    user = {
      name: currentUserName,
      referralCode,
      referrer: referrerCode || null,
      id: referralCode,
    };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  } else {
    // Update referrer if not set and referrerCode given
    if (!user.referrer && referrerCode && referrerCode !== user.referralCode) {
      user.referrer = referrerCode;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
  return user;
};

const Earn: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<{name: string; referralCode: string; referrer: string | null} | null>(null);

  // On mount, create/load user, handle referral from URL slug param
  useEffect(() => {
    // If slug is present, it is referrerCode
    const userData = createOrLoadUser(slug);
    setUser(userData);

    // If URL slug doesn't match user referralCode, redirect to correct one
    if (userData.referralCode !== slug) {
      navigate(`/earn/${userData.referralCode}`, { replace: true });
    }
  }, [slug, navigate]);

  const referralUrl = `https://t.me/hkswap_bot?start=${user?.referralCode || ''}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl).then(() => {
      alert('Referral URL copied to clipboard!');
    }, (err) => {
      console.error('Failed to copy: ', err);
    });
  };

  if (!user) return null;

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="bg-black text-white h-screen flex flex-col items-center justify-center rounded-t-[46px]">
              <div className="text-center">
                <h1 className="text-2xl mb-4">Referral Program</h1>
                <p>Your Referral Code: <strong>{user.referralCode}</strong></p>
                <p className="mb-4">Share your referral link:</p>
                <div className="flex items-center justify-center mb-4">
                  <input
                    type="text"
                    readOnly
                    value={referralUrl}
                    className="px-4 py-2 rounded text-black"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="ml-2 px-4 py-2 bg-gray-700 text-white rounded"
                  >
                    Copy
                  </button>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
        <Link to="/" className="text-center text-[#85827d] w-1/5">
          <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Exchange</p>
        </Link>
        <Link to="/mine" className="text-center text-[#85827d] w-1/5">
          <Mine className="w-8 h-8 mx-auto" />
          <p className="mt-1">Mine</p>
        </Link>
        <Link to="/friends" className="text-center text-[#85827d] w-1/5">
          <Friends className="w-8 h-8 mx-auto" />
          <p className="mt-1">Friends</p>
        </Link>
        <Link to={`/earn/${user.referralCode}`} className="text-center text-[#1c1f24] w-1/5 bg-[#f3ba2f] m-1 p-2 rounded-2xl">
          <Coins className="w-8 h-8 mx-auto" />
          <p className="mt-1">Earn</p>
        </Link>
        <Link to="/airdrop" className="text-center text-[#85827d] w-1/5">
          <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Airdrop</p>
        </Link>
      </div>
    </div>
  );
};

export default Earn;
