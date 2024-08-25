import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MinePageProps {
  points: number;
}

const MinePage: React.FC<MinePageProps> = ({ points }) => {
  const navigate = useNavigate();

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

  const calculateProgress = (levelIndex: number) => {
    if (levelIndex === levelNames.length - 1) {
      return points >= levelMinPoints[levelIndex] ? 100 : 0;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="bg-black text-white h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Mining Levels</h1>
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
      <button
        onClick={() => navigate(-1)}
        className="mt-auto px-4 py-2 bg-gray-700 text-white rounded"
      >
        Back
      </button>
    </div>
  );
};

export default MinePage;
