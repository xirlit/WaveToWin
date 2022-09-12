import React, { useEffect, useState } from 'react';
import './App.css'
import abi from './utils/WavePortal.json'
import { ethers } from 'ethers';

function App() {
  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState("");
  const messageRef = React.createRef();
  const [allWaves, setAllWaves] = useState([]);

  // const contractAddress = "0xEE31e923fD654e63e65328240a761A3079C90e8D";
  const contractAddress = "0x3748Db3d8c560D827cea3261785443eBa5D798fa";
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
      return false;
    }
  }

  const connectWallet = async () => {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const initializeWavePortal = () => {
    if (!(ethereum && currentAccount)) {
      return null;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

    return wavePortalContract ?? null;
  }

  const wave = async () => {
    try {
      if (ethereum) {
        const wavePortalContract = initializeWavePortal();

        if (!wavePortalContract)
          return;

        let message = messageRef.current.value;
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        getAllWaves();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getWaveCount = async () => {
    const wavePortalContract = initializeWavePortal();

    if (!wavePortalContract)
      return;

    let count = await wavePortalContract.getTotalWaves();
    console.log(count.toNumber());
  }

  const getAllWaves = async () => {
    const wavePortalContract = initializeWavePortal();

    if (!wavePortalContract)
      return;

    let allWaves = await wavePortalContract.getAllWaves();
    setAllWaves(allWaves);
    console.log(allWaves);
  }

  useEffect(() => {
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
                : <button className='button' onClick={connectWallet}>Connect a wallet</button>
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
