import React from 'react';
import { Link } from 'react-router-dom';
import { binanceLogo, hamsterCoin } from './images';
import Mine from './icons/Mine';
import Friends from './icons/Friends';
import Coins from './icons/Coins';

// Utility to create slug for /earn route
const createSlug = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, '');
};

const ProfilePage: React.FC = () => {
  const name = localStorage.getItem('userName') || '';
  const username = localStorage.getItem('username') || '';
  const email = localStorage.getItem('email') || '';
  const slug = createSlug(name);

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="bg-black text-white h-screen flex flex-col items-center justify-center rounded-t-[46px] px-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/9815/9815472.png"
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-[#f3ba2f] mb-4"
              />
              <div className="text-center">
                <h1 className="text-2xl mb-2">{name}</h1>
                <p className="text-[#aaa] text-sm mb-1">@{username}</p>
                <p className="text-[#aaa] text-sm">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}

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
        <Link to={`/earn/${slug}`} className="text-center text-[#85827d] w-1/5">
          <Coins className="w-8 h-8 mx-auto" />
          <p className="mt-1">Earn</p>
        </Link>
        <Link to="/airdrop" className="text-center text-[#1c1f24] w-1/5 bg-[#f3ba2f] m-1 p-2 rounded-2xl">
          <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Airdrop</p>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
