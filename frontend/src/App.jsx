import { useEffect, useState } from 'react'

import './App.css'
import web3 from './web3';
import lottery from './lottery';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
 
  useEffect(()=> {
    const checkMetaMask = async () => {
    if (window.ethereum) {
      try {
        // Ask MetaMask to connect
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // const accounts = await web3.eth.getAccounts();
        // console.log("Connected accounts:", accounts);
      } catch (err) {
        console.error("User denied MetaMask access:", err);
      }
    } else {
      console.warn("MetaMask not found");
    }
  }

  const loadBlockchainData = async () => {
    setManager(await lottery.methods.manager().call());
    setPlayers(await lottery.methods.getPlayers().call());
    setBalance(await web3.eth.getBalance(lottery.options.address));
  }
  
    checkMetaMask();  
    loadBlockchainData();
   
    
  }, [])


  const onEnter = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(amount, 'ether')
    })

    setMessage('You have been entered!');
  }

  const selectWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    setMessage('A winner has been picked!');
  }


  return (
    <>
      <div>
        <h1>Lottery Contract</h1>
        <p>This contract is managed by {manager}</p>
        <p>There are  currently {players.length} people entered and {web3.utils.fromWei(balance, 'ether')} ether</p>
      </div>
      <hr />
      <form onSubmit={onEnter}>
      <h2> Want to try your lucky?</h2>
      <div>
        <p>Enter the lottery by sending some ether!</p>
        <label>Amount of Ether to enter </label>
        <input 
        type = 'number'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <hr />
      <button>Enter</button>
      <hr />
      {/* <h2>{message}</h2> */}
      </form>

      <hr />
      <h4>Ready to pick winner?</h4>
      <button onClick={selectWinner}> PickWinner</button>
      <h2>{message}</h2>

    </>
  )
}

export default App
