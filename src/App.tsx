import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
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
import ProfilePage from './ProfilePage';
import { v4 as uuidv4 } from 'uuid';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import AllFirebaseUsers from './AllFirebaseUsers';
import AdminDashboard from './AdminDashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SplashScreen from './SplashScreen';

const App: React.FC = () => {
  // Level configuration
  const levelNames = [
    "Bronze", "Silver", "Gold", "Platinum", "Diamond",
    "Epic", "Legendary", "Master", "GrandMaster", "Lord"
  ];

  const levelMinPoints = [
    0, 5000, 25000, 100000, 1000000,
    2000000, 10000000, 50000000, 100000000, 1000000000
  ];

  const profitPerHourByLevel = [
    100, 200, 500, 1000, 5000,
    10000, 50000, 100000, 200000, 500000
  ];

  const pointsToAddByLevel = [1, 2, 3, 5, 7, 10, 12, 15, 18, 20];

  // State management
  const [showSplash, setShowSplash] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const [points, setPoints] = useState(0);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(true);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [showDailyBoxes, setShowDailyBoxes] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  // Auto mining state
  const [miningMode, setMiningMode] = useState<'manual' | 'auto'>('manual');
  const [autoMiningEndTime, setAutoMiningEndTime] = useState<number | null>(null);
  const [autoMiningProgress, setAutoMiningProgress] = useState(0);
  const [autoMiningPoints, setAutoMiningPoints] = useState(0);
  const AUTO_MINING_RATE = 20; // 20 coins per hour

  // Initialize app state
  useEffect(() => {
    const initializeApp = async () => {
      // Load all data from localStorage
      const savedPoints = localStorage.getItem('points');
      const savedUsername = localStorage.getItem('username');
      const savedEmail = localStorage.getItem('email');
      const savedAutoMiningEndTime = localStorage.getItem('autoMiningEndTime');

      // Set points
      setPoints(savedPoints ? parseInt(savedPoints, 10) : 0);

      // Set user data
      setUsername(savedUsername || '');
      setEmail(savedEmail || '');
      setIsNameModalOpen(!savedUsername || !savedEmail);

      // Set auto-mining state if active
      if (savedAutoMiningEndTime) {
        const endTime = parseInt(savedAutoMiningEndTime, 10);
        if (endTime > Date.now()) {
          setAutoMiningEndTime(endTime);
          setMiningMode('auto');

          // Calculate initial progress
          const totalDuration = 24 * 60 * 60 * 1000;
          const elapsed = endTime - Date.now();
          const progress = ((totalDuration - elapsed) / totalDuration) * 100;
          setAutoMiningProgress(progress);
        } else {
          localStorage.removeItem('autoMiningEndTime');
        }
      }

      setIsAppReady(true);
      setShowSplash(false);
    };

    initializeApp();
  }, []);

  // Level calculations
  const currentLevelIndex = () => levelMinPoints.findIndex((_, index) =>
    points < (levelMinPoints[index + 1] || Infinity)
  );

  const calculateProgress = () => {
    const levelIndex = currentLevelIndex();
    if (levelIndex === levelNames.length - 1) return points >= levelMinPoints[levelIndex] ? 100 : 0;
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    return ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
  };

  const currentLevel = () => levelNames[currentLevelIndex()] || "Bronze";
  const profitPerHour = profitPerHourByLevel[currentLevelIndex()];
  const pointsToAdd = pointsToAddByLevel[currentLevelIndex()];

  // Auto mining functions
  const getAutoMiningTimeLeft = () => {
    if (!autoMiningEndTime) return '00:00';
    const now = Date.now();
    const diff = autoMiningEndTime - now;

    if (diff <= 0) {
      setAutoMiningEndTime(null);
      return '00:00';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const startAutoMining = () => {
    const endTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    setAutoMiningEndTime(endTime);
    setAutoMiningPoints(0);
    setAutoMiningProgress(0);
    localStorage.setItem('autoMiningEndTime', endTime.toString());
    toast.success("Auto mining started for 24 hours!");
  };

  // Other utility functions
  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);
    if (now.getUTCHours() >= targetHour) target.setUTCDate(target.getUTCDate() + 1);
    const diff = target.getTime() - now.getTime();
    return `${Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0')}:${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')}`;
  };

  // Effects
  useEffect(() => {
    // Daily timers
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto mining effect - fixed to properly add coins
  useEffect(() => {
    if (!autoMiningEndTime) return;

    const interval = setInterval(() => {
      const now = Date.now();

      // Update progress
      const totalDuration = 24 * 60 * 60 * 1000;
      const elapsed = autoMiningEndTime - now;
      const progress = ((totalDuration - elapsed) / totalDuration) * 100;
      setAutoMiningProgress(progress);

      // Add coins (20/hour = 0.00555 per second)
      setAutoMiningPoints(prev => {
        const newValue = prev + (AUTO_MINING_RATE / 3600);
        return newValue;
      });

      // Check if mining completed
      if (now >= autoMiningEndTime) {
        setAutoMiningEndTime(null);
        localStorage.removeItem('autoMiningEndTime');
        toast.info("Auto mining completed!");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoMiningEndTime]);

  // Apply accumulated auto-mining points every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoMiningPoints >= 1) {
        setPoints(prev => {
          const newPoints = prev + Math.floor(autoMiningPoints);
          localStorage.setItem('points', newPoints.toString());
          return newPoints;
        });
        setAutoMiningPoints(prev => prev - Math.floor(prev));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoMiningPoints]);

  // Passive income from level
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        const newPoints = prev + Math.floor(profitPerHour / 3600);
        localStorage.setItem('points', newPoints.toString());
        return newPoints;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  // Event handlers
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (miningMode === 'auto') return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.transform = `perspective(1000px) rotateX(${-(e.clientY - rect.top - rect.height / 2) / 10}deg) rotateY(${(e.clientX - rect.left - rect.width / 2) / 10}deg)`;
    setTimeout(() => card.style.transform = '', 100);

    setPoints(prevPoints => {
      const newPoints = prevPoints + pointsToAdd;
      localStorage.setItem('points', newPoints.toString());
      return newPoints;
    });
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks(prevClicks => prevClicks.filter(click => click.id !== id));
  };

  const handleNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const usernameVal = (form.elements.namedItem('username') as HTMLInputElement).value.trim().toLowerCase();
    const emailVal = (form.elements.namedItem('email') as HTMLInputElement).value.trim().toLowerCase();
    const passwordVal = (form.elements.namedItem('password') as HTMLInputElement).value;

    const userQuery = query(collection(db, "users"),
      where("username", "==", usernameVal));
    const userSnapshot = await getDocs(userQuery);

    if (isLoginMode) {
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0].data();
        if (userDoc.password === passwordVal) {
          localStorage.setItem('username', userDoc.username);
          localStorage.setItem('email', userDoc.email);
          localStorage.setItem('userName', userDoc.name || '');
          localStorage.setItem('password', passwordVal);
          setUsername(userDoc.username);
          setEmail(userDoc.email);
          setIsNameModalOpen(false);
          toast.success("Logged in successfully!");
        } else {
          toast.error("Invalid password");
        }
      } else {
        toast.error("No matching user found. Please check credentials.");
      }
    } else {
      if (!userSnapshot.empty) {
        toast.error("Username already taken");
        return;
      }
      const name = (form.elements.namedItem('name') as HTMLInputElement)?.value.trim() || '';
      await addDoc(collection(db, "users"), {
        id: uuidv4(),
        name,
        username: usernameVal,
        email: emailVal,
        password: passwordVal,
        createdAt: new Date().toISOString(),
        points: 0,
        autoMiningCount: 0,
        manualMiningCount: 0
      });
      localStorage.setItem('username', usernameVal);
      localStorage.setItem('email', emailVal);
      localStorage.setItem('userName', name);
      localStorage.setItem('password', passwordVal);
      setUsername(usernameVal);
      setEmail(emailVal);
      setIsNameModalOpen(false);
      toast.success("Account created successfully!");
    }
  };

  if (showSplash || !isAppReady) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/firebase-users" element={<AllFirebaseUsers />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={
          <div className="bg-black flex justify-center">
            {isNameModalOpen && (
              <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                <form onSubmit={handleNameSubmit} className="bg-[#1d1d1d] p-8 rounded w-96">
                  <h2 className="text-white mb-4">{isLoginMode ? "Login" : "Register"} your account</h2>

                  {!isLoginMode && (
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="mb-3 px-4 py-2 rounded w-full"
                      required
                    />
                  )}

                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="mb-3 px-4 py-2 rounded w-full"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="mb-3 px-4 py-2 rounded w-full"
                    required
                  />

                  <button type="submit" className="mt-4 px-4 py-2 bg-white text-black rounded w-full">
                    {isLoginMode ? "Login" : "Register"}
                  </button>

                  <p
                    className="text-sm text-center text-[#aaa] mt-4 cursor-pointer"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                  >
                    {isLoginMode ? "Don't have an account? Register" : "Already have an account? Login"}
                  </p>
                </form>
              </div>
            )}

            <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
              <div className="px-4 z-10">
                <div className="flex items-center justify-between pt-4 px-2">
                  <div className="text-white font-semibold text-lg">{username}</div>
                  <Link to="/profile">
                    <img src="https://cdn-icons-png.flaticon.com/512/9815/9815472.png" alt="Profile" className="w-8 h-8 rounded-full cursor-pointer" />
                  </Link>
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

                  <div className="px-4 mt-4 flex flex-col items-center">
                    <div
                      className={`w-80 h-80 p-4 rounded-full circle-outer relative ${miningMode === 'auto' ? 'auto-mining' : ''}`}
                      onClick={miningMode === 'manual' ? handleCardClick : undefined}
                      style={{
                        cursor: miningMode === 'manual' ? 'pointer' : 'default',
                        border: miningMode === 'auto' ? '4px solid #333' : 'none',
                      }}
                    >
                      {miningMode === 'auto' && (
                        <div className="absolute inset-0 rounded-full" style={{
                          background: `conic-gradient(#f3ba2f ${autoMiningProgress * 3.6}deg, transparent 0deg)`,
                          padding: '4px',
                          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #fff calc(100% - 3px))',
                          mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #fff calc(100% - 3px))'
                        }}></div>
                      )}

                      <div className="w-full h-full rounded-full circle-inner">
                        <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
                      </div>
                    </div>

                    <div className="flex mt-6 bg-[#272a2f] rounded-full p-1">
                      <button
                        className={`px-6 py-2 rounded-full ${miningMode === 'manual' ? 'bg-[#f3ba2f] text-black' : 'text-white'}`}
                        onClick={() => setMiningMode('manual')}
                      >
                        Manual
                      </button>
                      <button
                        className={`px-6 py-2 rounded-full ${miningMode === 'auto' ? 'bg-[#f3ba2f] text-black' : 'text-white'}`}
                        onClick={() => setMiningMode('auto')}
                      >
                        Auto
                      </button>
                    </div>

                    {miningMode === 'auto' && (
                      <div className="mt-4 text-center">
                        {!autoMiningEndTime ? (
                          <button
                            className="bg-[#f3ba2f] text-black px-6 py-2 rounded-full font-bold"
                            onClick={startAutoMining}
                          >
                            Start Auto Mining (20/hr)
                          </button>
                        ) : (
                          <div className="text-white">
                            <p>Auto Mining Active</p>
                            <p className="text-[#f3ba2f]">{getAutoMiningTimeLeft()} remaining</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
                <Link to={`/earn/${username}`} className="text-center text-[#85827d] w-1/5">
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
          </div>
        } />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;