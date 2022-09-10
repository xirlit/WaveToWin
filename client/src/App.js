import React, { useEffect, useState } from 'react';
import './App.css'
import ethers from 'ethers';

function App() {
  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        return true;
      } else {
        console.log("No authorized account found")
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected().then(result => !result && connectWallet());
  }, [])

  return (
    <>
      <header>We testing the Web3</header>
      <div className='main-content'>
        <button className='button--wave'>Click to wave bro</button>
        {!currentAccount &&
          <button className='button--wave' onClick={connectWallet}>Connect a wallet</button>
        }
      </div>
      <footer>Looks good so far</footer>
    </>
  );
}

export default App;
