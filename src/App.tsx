import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Hamster from './icons/Hamster';
import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, hamsterCoin, mainCharacter } from './images';
import Info from './icons/Info';
import Settings from './icons/Settings';
import Mine from './icons/Mine';
import Friends from './icons/Friends';
import Coins from './icons/Coins';
import WalletConfig from './WalletConfig';
import WalletCallback from './WalletCallback';
import Earn from './Earn';
import FriendsPage from './Friends';
import Users from './Users';
import MinePage from './Mine';
import AirdropPage from './Airdrop';
import { v4 as uuidv4 } from 'uuid';

// Utility function to create a slug from a string
const createSlug = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, '');
};

const App: React.FC = () => {
  const levelNames = [
    "Bronze",    // From 0 to 4999 coins
    "Silver",    // From 5000 coins to 24,999 coins
    "Gold",      // From 25,000 coins to 99,999 coins
    "Platinum",  // From 100,000 coins to 999,999 coins
    "Diamond",   // From 1,000,000 coins to 2,000,000 coins
    "Epic",      // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master",    // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord"       // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = [
    0,        // Bronze
    5000,     // Silver
    25000,    // Gold
    100000,   // Platinum
    1000000,  // Diamond
    2000000,  // Epic
    10000000, // Legendary
    50000000, // Master
    100000000,// GrandMaster
    1000000000// Lord
  ];

  const profitPerHourByLevel = [
    100,      // Bronze
    200,      // Silver
    500,      // Gold
    1000,     // Platinum
    5000,     // Diamond
    10000,    // Epic
    50000,    // Legendary
    100000,   // Master
    200000,   // GrandMaster
    500000    // Lord
  ];

  // Adjusted pointsToAdd logic for levels
  const pointsToAddByLevel = [1, 2, 3, 5, 7, 10, 12, 15, 18, 20];

  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });

  const [userName, setUserName] = useState(() => {
    // Ensure the username is always retrieved in slug form
    const storedName = localStorage.getItem('userName');
    return storedName ? createSlug(storedName) : '';
  });

  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [showDailyBoxes, setShowDailyBoxes] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(!userName);

  // State for daily timers
  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const currentLevelIndex = () => {
    return levelMinPoints.findIndex((_, index) => {
      return points < (levelMinPoints[index + 1] || Infinity);
    });
  };

  const calculateProgress = () => {
    const levelIndex = currentLevelIndex();
    if (levelIndex === levelNames.length - 1) {
      return points >= levelMinPoints[levelIndex] ? 100 : 0;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  const currentLevel = () => {
    return levelNames[currentLevelIndex()] || "Bronze";
  };

  const profitPerHour = profitPerHourByLevel[currentLevelIndex()];
  const pointsToAdd = pointsToAddByLevel[currentLevelIndex()];

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints(prevPoints => {
        const newPoints = prevPoints + pointsPerSecond;
        localStorage.setItem('points', newPoints.toString());
        return newPoints;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    setPoints(prevPoints => {
      const newPoints = prevPoints + pointsToAdd;
      localStorage.setItem('points', newPoints.toString());
      return newPoints;
    });
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const handleNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameInput = e.currentTarget.elements.namedItem('name') as HTMLInputElement;
    const name = nameInput.value.trim();
    const slug = createSlug(name);

    if (slug) {
      setUserName(slug);
      localStorage.setItem('userName', slug); // Store slugified username
      setIsNameModalOpen(false);

      // Add user to the local storage
      const userId = uuidv4();
      const newUser = { id: userId, name: slug }; // Store the slug as the name
      const existingUsers = localStorage.getItem('users');
      const usersList = existingUsers ? JSON.parse(existingUsers) : [];
      usersList.push(newUser);
      localStorage.setItem('users', JSON.stringify(usersList));

      // Store referrer info
      const referrer = localStorage.getItem('referrer');
      if (referrer) {
        localStorage.setItem('referrerOf_' + userId, referrer);
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/save-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: newUser }),
        });

        if (!response.ok) {
          alert('Failed to add user.');
        }
      } catch (error) {
        console.error('Failed to add user:', error);
      }
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/wallet-config" element={<WalletConfig />} />
        <Route path="/wallet-callback" element={<WalletCallback />} />
        <Route path="/earn/:slug" element={<Earn />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/users" element={<Users />} />
        <Route path="/mine" element={<MinePage points={points} />} />
        <Route path="/airdrop" element={<AirdropPage />} />
        <Route path="/" element={
          <div className="bg-black flex justify-center">
            {isNameModalOpen && (
              <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                <form onSubmit={handleNameSubmit} className="text-center">
                  <p className="text-white mb-4">Enter your name</p>
                  <input
                    type="text"
                    name="name"
                    className="px-4 py-2 rounded"
                    required
                  />
                  <button type="submit" className="mt-4 px-4 py-2 bg-white text-black rounded">Submit</button>
                </form>
              </div>
            )}
            <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
              <div className="px-4 z-10">
                <div className="flex items-center space-x-2 pt-4">
                  <div className="p-1 rounded-lg bg-[#1d2025]">
                    <Hamster size={24} className="text-[#d4d4d4]" />
                  </div>
                  <div>
                    <p className="text-sm">{userName} (CEO)</p>
                  </div>
                </div>
                <div className="flex items-center justify-between space-x-4 mt-1">
                  <div className="flex items-center w-1/3">
                    <div className="w-full">
                      <div className="flex justify-between">
                        <p className="text-sm" onClick={() => setShowDailyBoxes(!showDailyBoxes)}>{currentLevel()}</p>
                        <p className="text-sm">{currentLevelIndex() + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
                      </div>
                      <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                        <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                          <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
                    <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
                    <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                    <div className="flex-1 text-center">
                      <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
                      <div className="flex items-center justify-center space-x-1">
                        <img src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
                        <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
                        <Info size={20} className="text-[#43433b]" />
                      </div>
                    </div>
                    <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                    <Link to="/wallet-config">
                      <Settings className="text-white" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
                <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
                  {showDailyBoxes && (
                    <div className="px-4 mt-6 flex justify-between gap-2">
                      <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                        <div className="dot"></div>
                        <img src={dailyReward} alt="Daily Reward" className="mx-auto w-12 h-12" />
                        <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
                        <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyRewardTimeLeft}</p>
                      </div>
                      <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                        <div className="dot"></div>
                        <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
                        <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
                        <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyCipherTimeLeft}</p>
                      </div>
                      <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                        <div className="dot"></div>
                        <img src={dailyCombo} alt="Daily Combo" className="mx-auto w-12 h-12" />
                        <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
                        <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyComboTimeLeft}</p>
                      </div>
                    </div>
                  )}

                  <div className="px-4 mt-4 flex justify-center">
                    <div className="px-4 py-2 flex items-center space-x-2">
                      <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                      <p className="text-4xl text-white">{points.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="px-4 mt-4 flex justify-center">
                    <div
                      className="w-80 h-80 p-4 rounded-full circle-outer"
                      onClick={handleCardClick}
                    >
                      <div className="w-full h-full rounded-full circle-inner">
                        <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom fixed div */}
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
              <Link to="/" className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl">
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
              <Link to={`/earn/${userName}`} className="text-center text-[#85827d] w-1/5">
                <Coins className="w-8 h-8 mx-auto" />
                <p className="mt-1">Earn</p>
              </Link>
              <Link to="/airdrop" className="text-center text-[#85827d] w-1/5">
                <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
                <p className="mt-1">Airdrop</p>
              </Link>
            </div>

            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
                style={{
                  top: `${click.y - 42}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-out`
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                {pointsToAdd}
              </div>
            ))}
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;
