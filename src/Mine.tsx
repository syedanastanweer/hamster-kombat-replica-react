import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Remove `useNavigate` if not needed
import { binanceLogo, hamsterCoin } from './images';
import Mine from './icons/Mine';
import Friends from './icons/Friends';
import Coins from './icons/Coins';

// Utility function to create a slug from a string
const createSlug = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, '');
};

interface MinePageProps {
  points: number;
}

const MinePage: React.FC<MinePageProps> = ({ points }) => {
  // Removed the unused `navigate` declaration

  const levelNames = [
    "Bronze", "Silver", "Gold", "Platinum", "Diamond",
    "Epic", "Legendary", "Master", "GrandMaster", "Lord"
  ];

  const levelMinPoints = [
    0, 5000, 25000, 100000, 1000000,
    2000000, 10000000, 50000000, 100000000, 1000000000
  ];

  const calculateProgress = (levelIndex: number) => {
    if (levelIndex === levelNames.length - 1) {
      return points >= levelMinPoints[levelIndex] ? 100 : 0;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  const storedName = localStorage.getItem('userName');
  const slug = storedName ? createSlug(storedName) : '';

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="bg-black text-white h-screen p-4 flex flex-col rounded-t-[46px]">
              <h1 className="text-2xl font-bold mb-4 mt-4rem">Mining Levels</h1>
              {levelNames.map((level, index) => {
                const progress = calculateProgress(index);
                const isCompleted = progress === 100;
                const barColor = isCompleted ? 'bg-green-500' : 'bg-yellow-500';

                return (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between">
                      <span>{level}</span>
                      <span>{isCompleted ? '100%' : `${progress.toFixed(2)}%`}</span>
                    </div>
                    <div className="w-full h-4 bg-gray-700 rounded-full mt-2 relative overflow-hidden">
                      <div
                        className={`${barColor} h-full absolute top-0 left-0 transition-all duration-1000`}
                        style={{ width: `${progress}%` }}
                      />
                      <div
                        className="h-full bg-gray-700 absolute top-0 right-0"
                        style={{ width: `${100 - progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
        <Link to="/" className="text-center text-[#85827d] w-1/5">
          <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Exchange</p>
        </Link>
        <Link to="/mine" className="text-center text-[#1c1f24] w-1/5 bg-[#f3ba2f] m-1 p-2 rounded-2xl">
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
        <Link to="/airdrop" className="text-center text-[#85827d] w-1/5">
          <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Airdrop</p>
        </Link>
      </div>
    </div>
  );
};

export default MinePage;
