const { TronWeb } = require('tronweb');
const fs = require('fs');

async function createSession() {
    const tronWeb = new TronWeb({ fullHost: 'https://api.trongrid.io' });

    // 生成新的会话密钥对
    const sessionPrivateKey = tronWeb.utils.accounts.generateAccount().privateKey;
    const sessionPublicKey = tronWeb.address.fromPrivateKey(sessionPrivateKey).replace('0x', '41');

    // 保存会话密钥
    const sessionData = {
        privateKey: sessionPrivateKey,
        publicKey: sessionPublicKey,
        createdAt: new Date().toISOString()
    };

    fs.writeFileSync('.session', JSON.stringify(sessionData, null, 2));
    console.log('✅ 会话密钥已生成并保存到 .session 文件');
    console.log('🔑 私钥:', sessionPrivateKey);
    console.log('🔑 公钥:', sessionPublicKey);
}

createSession().catch(console.error);