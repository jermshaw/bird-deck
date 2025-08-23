import React, { useState } from 'react';
import './App.css';

function App() {
  const [collectedBirds, setCollectedBirds] = useState([]);
  
  const birds = [
    { id: 1, name: 'Robin', emoji: '🐦', rarity: 'common' },
    { id: 2, name: 'Eagle', emoji: '🦅', rarity: 'rare' },
    { id: 3, name: 'Owl', emoji: '🦉', rarity: 'uncommon' },
    { id: 4, name: 'Penguin', emoji: '🐧', rarity: 'rare' },
    { id: 5, name: 'Flamingo', emoji: '🦩', rarity: 'uncommon' },
    { id: 6, name: 'Peacock', emoji: '🦚', rarity: 'rare' },
    { id: 7, name: 'Duck', emoji: '🦆', rarity: 'common' },
    { id: 8, name: 'Swan', emoji: '🦢', rarity: 'uncommon' }
  ];

  const collectBird = () => {
    const randomBird = birds[Math.floor(Math.random() * birds.length)];
    if (!collectedBirds.find(bird => bird.id === randomBird.id)) {
      setCollectedBirds([...collectedBirds, randomBird]);
    }
  };

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'common': return '#8BC34A';
      case 'uncommon': return '#2196F3';
      case 'rare': return '#9C27B0';
      default: return '#757575';
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>🐦 Bird Deck</h1>
        <p>Can you collect all the birds in the world?</p>
        <div className="stats">
          <span>Collected: {collectedBirds.length}/{birds.length}</span>
        </div>
      </div>

      <div className="game-area">
        <button className="collect-button" onClick={collectBird}>
          🎯 Spot a Bird!
        </button>

        <div className="bird-collection">
          <h2>Your Collection</h2>
          <div className="bird-grid">
            {birds.map(bird => {
              const isCollected = collectedBirds.find(collected => collected.id === bird.id);
              return (
                <div 
                  key={bird.id} 
                  className={`bird-card ${isCollected ? 'collected' : 'uncollected'}`}
                  style={{ borderColor: isCollected ? getRarityColor(bird.rarity) : '#ddd' }}
                >
                  <div className="bird-emoji">
                    {isCollected ? bird.emoji : '❓'}
                  </div>
                  <div className="bird-name">
                    {isCollected ? bird.name : '???'}
                  </div>
                  {isCollected && (
                    <div 
                      className="bird-rarity"
                      style={{ color: getRarityColor(bird.rarity) }}
                    >
                      {bird.rarity}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {collectedBirds.length === birds.length && (
          <div className="victory">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You've collected all the birds!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
