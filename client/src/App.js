import React from 'react';
import './App.css'

function App() {
  const wave = () => console.log('wave');

  return (
    <>
      <header>We testing the Web3</header>
      <div className='main-content'>
        <button className='button--wave' onClick={wave}>Click to wave bro</button>
      </div>
      <footer>Looks good so far</footer>
    </>
  );
}

export default App;
