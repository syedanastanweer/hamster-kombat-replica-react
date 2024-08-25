import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Earn: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const referralUrl = `https://t.me/hkswap_bot?start=${slug}`;
  const [referrer, setReferrer] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has been referred by someone
    if (slug) {
      localStorage.setItem('referrer', slug);
    }
  }, [slug]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl).then(() => {
      alert('Referral URL copied to clipboard!');
    }, (err) => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="bg-black text-white h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Referral Program</h1>
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
  );
};

export default Earn;
