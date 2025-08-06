
const HDWalletProvider = require("truffle-hdwallet-provider")
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");
require('dotenv').config();

// console.log('interface', interface);

if (!process.env.MNEMONIC || !process.env.INFURA) {
    throw new Error("Please set MNEMONIC and INFURA environment variables");
}

const provider = new HDWalletProvider(process.env.MNEMONIC, process.env.INFURA);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({gas: '1000000', from: accounts[0], maxFeePerGas: web3.utils.toWei('100', 'gwei'), maxPriorityFeePerGas: web3.utils.toWei('2', 'gwei')});

    console.log("Contract deployed to", result.options.address);
    provider.engine.stop();

}

deploy();
