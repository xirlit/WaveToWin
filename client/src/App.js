import React, { useEffect, useState } from 'react';
import './App.css'
import abi from './utils/WavePortal.json'
import { ethers } from 'ethers';

function App() {
  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState("");
  const messageRef = React.createRef();
  const [allWaves, setAllWaves] = useState([]);

  // address and JSON file for our contract 
  const contractAddress = "0x126ac14ebF13C2dF11FA7f147f3F7a7039E2F2E5";
  const contractABI = abi.abi;

  // checks if the wallet is connected
  // returns success
  const checkIfWalletIsConnected = async () => {
    try {

      // check if user has MetaMask
      if (!ethereum) {
        alert("Get MetaMask!");
        return false;
      }

      // get all users accounts
      const accounts = await ethereum.request({ method: "eth_accounts" });

      // if we have some accounts, we set the first one as active
      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // prompts to connect a wallet 
  const connectWallet = async () => {
    try {
      // MetaMask prompt window
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  // initializes connection to the contract
  // returns contract object
  const initializeWavePortal = () => {
    // if we dont have MetaMask or connected account, we return null
    if (!(ethereum && currentAccount)) {
      return null;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

    return wavePortalContract ?? null;
  }

  // waves at the contract
  const wave = async () => {
    try {
      const wavePortalContract = initializeWavePortal();

      // we dont have a contract connection - no account connected / no metamask / wrong contract address
      if (!wavePortalContract)
        return;

      let message = messageRef.current.value;

      const waveTxn = await wavePortalContract.wave(message);
      await waveTxn.wait();

      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());
      getAllWaves();

    } catch (error) {
      console.log(error);
    }
  }

  // writes a total number of waves to console
  const getWaveCount = async () => {
    const wavePortalContract = initializeWavePortal();

    // we dont have a contract connection - no account connected / no metamask / wrong contract address
    if (!wavePortalContract)
      return;

    let count = await wavePortalContract.getTotalWaves();
    console.log(count.toNumber());
  }

  // calls the contract to return info about all waves
  const getAllWaves = async () => {
    const wavePortalContract = initializeWavePortal();

    // we dont have a contract connection - no account connected / no metamask / wrong contract address
    if (!wavePortalContract)
      return;

    let allWaves = await wavePortalContract.getAllWaves();
    setAllWaves(allWaves);
  }

  useEffect(() => {
    // if we dont have a connected account, prompt MetaWave to connect one
    checkIfWalletIsConnected().then(result => !result && connectWallet());
  }, [])

  useEffect(() => {
    getAllWaves();
  }, [currentAccount]);

  return (
    <>
      <header>We testing the Web3</header>
      <div className='main-page'>
        <div className='flex-container'>
          <div className='flex-container--col'>
            <div className='container--centered'>
              {currentAccount ?
                <>
                  <p>Write your message here 🤪</p>
                  <input type='text' ref={messageRef} placeholder='Hello commrade'></input>
                  <button className='button' onClick={wave}>Click to wave and send the message bro</button>
                  <button className='button' onClick={getWaveCount}>Get total wave count</button>
                  <button className='button' onClick={getAllWaves}>Get all waves</button>
                </>
                :
                <>
                  <p>Please connect your wallet 🥺</p>
                  <button className='button' onClick={connectWallet}>Connect a wallet</button>
                </>
              }
            </div>
          </div>

          <div className='flex-container--col'>
            <div className='container--centered'>
              <p>You can see all your waves here 😊</p>
              <div className='waves'>
                {allWaves.map((wave, index) => {
                  return (
                    <div key={index} className='wave-info'>
                      <div><b>Caller address:</b> {wave.callerAddress}</div>
                      <div><b>Message:</b> {wave.message}</div>
                      <div><b>Timestamp:</b> {wave.timestamp.toNumber()}</div>
                    </div>
                  );
                })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>Looks good so far</footer>
    </>
  );
}

export default App;
