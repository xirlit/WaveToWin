import React, { useEffect, useState } from 'react';
import './App.css'
import abi from './utils/WavePortal.json'
import { ethers } from 'ethers';

function App() {
  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0xEE31e923fD654e63e65328240a761A3079C90e8D";
  const contractABI = abi.abi;

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

  const wave = async () => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getWaveCount = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await wavePortalContract.getTotalWaves();
    console.log(count.toNumber());
  }

  useEffect(() => {
    checkIfWalletIsConnected().then(result => !result && connectWallet());
  }, [])

  return (
    <>
      <header>We testing the Web3</header>
      <div className='main-content'>
        <div className='buttons-area'>
          <button className='button' onClick={wave}>Click to wave bro</button>
          <button className='button' onClick={getWaveCount}>Get total wave count</button>
          {!currentAccount &&
            <button className='button' onClick={connectWallet}>Connect a wallet</button>
          }
        </div>
      </div>
      <footer>Looks good so far</footer>
    </>
  );
}

export default App;
