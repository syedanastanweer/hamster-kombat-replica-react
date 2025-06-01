import React, { useEffect } from 'react';
import { binanceLogo, hamsterCoin } from './images';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
      backgroundColor: '#121212',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px'
    },
    logo: {
      width: '100px',
      height: '100px',
      animation: 'spin 2s linear infinite'
    },
    progressBar: {
      width: '200px',
      height: '4px',
      backgroundColor: '#333',
      borderRadius: '2px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      width: '0%',
      backgroundColor: '#F3BA2F',
      animation: 'fill 2.5s linear forwards'
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '20px'
    },
    coinIcon: {
      width: '20px',
      height: '20px'
    },
    appName: {
      color: '#F3BA2F',
      fontWeight: 'bold',
      fontSize: '16px'
    },
    developerNote: {
      position: 'absolute',
      bottom: '20px',
      fontSize: '12px',
      color: '#888'
    }
  };

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes fill {
        from { width: 0%; }
        to { width: 100%; }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <img 
          src={binanceLogo} 
          alt="App Logo" 
          style={styles.logo} 
        />
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>
        <div style={styles.footer}>
          <img 
            src={hamsterCoin} 
            alt="Hamster Coin" 
            style={styles.coinIcon} 
          />
          <span style={styles.appName}>HK Swap</span>
        </div>
      </div>
      <div style={styles.developerNote}>Developed by Softyfier</div>
    </div>
  );
};

export default SplashScreen;
