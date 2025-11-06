// 在文件顶部必须加上这行，告诉 Next.js 这是个客户端组件
'use client';

// 导入我们需要的工具
import { useState } from 'react';
import { ethers } from 'ethers';

// ----------------------------------------------------------------
// 🚀 第二阶段: 代币合约的“说明书” (ABI)
// ----------------------------------------------------------------
// 这个 ABI 保持不变，因为它在所有 EVM 链上都是通用的
const minAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// ----------------------------------------------------------------
// 🚀 第二阶段 (BNB 链版): 代币合约的“地址”
// ----------------------------------------------------------------
// 这就是你提供的 BNB Smart Chain (Mainnet) 上的 USDT 代币地址
const usdtTokenAddress = "0x55d398326f99059ff775485246999027b3197955";


export default function Home() {
  // --- 状态变量 ---
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null); // 将用于存储 BNB 余额
  const [tokenBalance, setTokenBalance] = useState<string | null>(null); // 将用于存储 USDT 余额


  // 核心函数：连接钱包并获取所有余额
  const connectWallet = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        // --- 1. 连接钱包并获取 provider 和 signer ---
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        
        // **关键提示**: 确保你的 MetaMask 已经切换到了 BNB Smart Chain!
        // 否则, provider 会连接到错误的链上。

        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        // --- 2. 获取主网币 (BNB) 余额 ---
        const balanceWei = await provider.getBalance(userAddress);
        // ethers.formatEther() 同样适用于 BNB (因为它们都是18位小数)
        const balanceNative = ethers.formatEther(balanceWei);

        setAccount(userAddress);
        setBalance(balanceNative); // 存入 BNB 余额

        // --- 3. 读取代币 (USDT) 合约 ---
        const contract = new ethers.Contract(usdtTokenAddress, minAbi, provider);
        
        // 查询小数位数 (USDT 在 BNB 链上是 18 位)
        const decimals = await contract.decimals();
        
        // 查询你的 USDT 余额
        const tokenBalanceWei = await contract.balanceOf(userAddress);

        // 使用 formatUnits 将余额格式化
        const balanceFormatted = ethers.formatUnits(tokenBalanceWei, decimals);
        
        console.log("BNB 余额:", balanceNative);
        console.log("USDT 代币小数位数:", decimals.toString());
        console.log("USDT 余额:", balanceFormatted);

        // 存入 USDT 余额
        setTokenBalance(balanceFormatted);

      } catch (error) {
        console.error("操作失败:", error);
        alert("操作失败！请确保你的 MetaMask 已经切换到 'BNB Smart Chain'。");
      }
    } else {
      alert("请先安装 MetaMask 钱包！");
    }
  };

  // --- 升级页面的 HTML 结构 (JSX) ---
  return (
    <main style={{ padding: '50px', textAlign: 'center' }}>
      <h1>我的 DApp (BNB 链主网版)</h1>
      
      {account ? (
        <div>
          <h2>🎉 连接成功!</h2>
          <p><strong>你的钱包地址:</strong> {account}</p>
          <hr style={{ margin: '20px 0' }} />

          {/* 标签已更新为 BNB */}
          <p><strong>你的 BNB 余额:</strong> {balance} BNB</p>
          
          <p><strong>你的 USDT 余额:</strong> {tokenBalance} USDT</p>

        </div>
      ) : (
        <button 
          onClick={connectWallet} 
          style={{ fontSize: '20px', padding: '10px 20px', cursor: 'pointer' }}
        >
          连接我的 MetaMask 钱包
        </button>
      )}
    </main>
  );
}