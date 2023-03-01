import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [balances, setBalances] = useState([]);
  const [block, setblock] = useState(null);
  const [searchBlock, setSearchBlock] = useState(0);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  });

  const getBlockTrasanctions = async (event) => {
    event.preventDefault();
    alchemy.core
      .getBlockWithTransactions(Number(searchBlock))
      .then((result) => {
        console.log('result', result);
        setblock(result);
      });
  };

  const getTokenBalances = async (event) => {
    event.preventDefault();
    alchemy.core
      .getTokenBalances('0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE')
      .then((result) => {
        setBalances(result.tokenBalances);
      });
  };

  const getEtherValue = (tokenBalance) => {
    return ethers.utils.formatEther(tokenBalance);
  };

  return (
    <div className="App">
      <h1>Ethereum {Network.ETH_MAINNET}</h1>
      Block Number: {blockNumber}{' '}
      <form onSubmit={getBlockTrasanctions} className="Form">
        <label htmlFor="BlockNumber">Block Number: {''}</label>
        <input
          id="blockNumber"
          type="number"
          value={searchBlock}
          onChange={(event) => setSearchBlock(event.target.value)}
        />
        <button type="submit"> Get Block Information </button>
      </form>
      {block !== null ? (
        <div>
          <h2>Block #{block.number}</h2>
          <p>Timestamp: {new Date(block.timestamp * 1000).toString()}</p>
          <p>Hash: {block.hash}</p>
          <p>Ancestor: {block.parentHash}</p>
          <p>Difficulty: {block.difficulty}</p>
          <p>Count transactions: {block.transactions.length}</p>
        </div>
      ) : (
        <h3>Click for obtain more information about the block </h3>
      )}
      <form onSubmit={getTokenBalances} className="Form">
        <button type="submit">Get ETH Balances</button>
      </form>
      {balances.length !== 0 ? (
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {balances.map(({ contractAddress, tokenBalance }) => (
              <tr key={contractAddress}>
                <td>{contractAddress}</td>
                <td>{getEtherValue(tokenBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h3>Enter the token address </h3>
      )}
    </div>
  );
}

export default App;
