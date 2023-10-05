import { useState } from "react";
import { Web3 } from "web3";
// import axios from "axios";

const web3 = new Web3(window.ethereum);
const contractAddress = "0x6fe267bb9d408e202d10c341668ef95bed19946b";
const ABI = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_contactNumber","type":"uint256"},{"internalType":"string","name":"_personAddress","type":"string"},{"internalType":"uint256","name":"_aadharNumber","type":"uint256"}],"name":"doingKYC","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"add","type":"address"}],"name":"viewDetails","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"contactNumber","type":"uint256"},{"internalType":"string","name":"personAddress","type":"string"},{"internalType":"uint256","name":"aadharNumber","type":"uint256"},{"internalType":"bool","name":"status","type":"bool"}],"internalType":"struct kyc.details","name":"","type":"tuple"}],"stateMutability":"view","type":"function"}];
let contract;

function App() {
  const [ownerAddress, setOwnerAddress] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [addressInfo, setAddressInfo] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [hash,setHash] = useState("");
  const [error,setError] = useState("");

  const connectWallet = async () => {
    try {
      // Request access to the user's wallet
      const acc = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setOwnerAddress(acc[0]);
      contract = new web3.eth.Contract(ABI,contractAddress);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const connectToContract = async () => {
    console.log("connected to contract");
  }

  const submitKYC = async () => {
    console.log("submitting");
      const x = { 
          from : ownerAddress,
          to :contractAddress,
          gas : 5000000,
          data : contract.methods.doingKYC(name, contact, addressInfo, aadhar).encodeABI(),
      };
      console.log("generating txhash");
      const txnHash = await web3.eth.sendTransaction(x)
      .on("txnHash",txnHash => console.log("receipt",txnHash));

      setHash(txnHash.transactionHash);
  }

  // const nameValidation = async () => {

  // }

  const handleNameChange = (value) => {
    if (value.trim() === '') {
      setError('Name is required.');
    } else if (!/^[A-Za-z\s]+$/.test(value)) {
      setError('Name should only contain letters and spaces.');
    } else {
      setError('');
    }
    setName(value);
  }

  const handleAddressChange = (value) => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      setError('Invalid Ethereum address.');
    } else {
      setError('');
    }
  
    setAddressInfo(value);
  };
  
  const handleAadharChange = (value) => {
    if (!/^\d{12}$/.test(value)) {
      setError('Invalid Aadhar card number. It should have 12 digits.');
    } else {
      setError('');
    }

    setAadhar(value);
  };

  const handleContactChange = (value) => {    
    // Validate phone number format (example: 123-456-7890)
    if (!/^\d{3}-\d{3}-\d{4}$/.test(value)) {
      setError('Invalid phone number format');
    } else {
      setError('');
    }

    setContact(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      submitKYC();
      // Handle success and error responses
    } catch (error) {
      console.error("Error submitting KYC:", error);
    }
  };

  return (
    <div>
      <h2>KYC Form</h2>
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>Wallet Address: {ownerAddress}</p>
      <button onClick={connectToContract}>Connect to Contract</button>
      <p>Address: {contractAddress}</p>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
        <br />
        <label>Address:</label>
        <input
          type="text"
          value={addressInfo}
          onChange={(e) => handleAddressChange(e.target.value)}
          required
        />
        <br />
        <label>Aadhar Number:</label>
        <input
          type="text"
          value={aadhar}
          onChange={(e) => handleAadharChange(e.target.value)}
          required
        />
        <br />
        <label>Contact Number:</label>
        <input
          type="number"
          value={contact}
          onChange={(e) => handleContactChange(e.target.value)}
          required
        />
        <br />
        <button onClick={submitKYC}>Submit KYC</button>
        <p>Transaction Hash:<a href={`https://sepolia.etherscan.io/tx/${hash}`}></a>{hash}</p>
      </form>
    </div>
  );
}

export default App;
