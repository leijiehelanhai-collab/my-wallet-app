// 文件名: app/page.tsx
'use client'; // 客户端组件

// --- 🚀 1. 导入 'useState' 和 'useEffect' ---
import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

// BUSD 代币在 BNB 链上的地址
const busdTokenAddress = '0x55d398326f99059ff775485246999027b3197955';

export default function Home() {
  
  // --- 🚀 2. "大神"的 Hydration 解决方案 ---
  // 创建一个状态，用来追踪我们是否在客户端上 "安全" 了
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 这个函数只会在客户端上、Hydration 完成后运行
    setIsMounted(true);
  }, []); // 空依赖数组确保它只运行一次
  // --- 🚀 方案结束 ---


  // --- 自动驾驶仪 (Wagmi hooks) ---
  const { address, isConnected, chain } = useAccount();
  const { data: bnbBalance } = useBalance({ address });
  const { data: tokenBalance } = useBalance({ address, token: busdTokenAddress });
  const { open } = useWeb3Modal();


  // --- 🚀 3. 关键：在 "isMounted" 变为 true 之前，不渲染任何东西 ---
  // 这能保证服务器的渲染 (isMounted=false, 返回null)
  // 和客户端的第一次渲染 (isMounted=false, 返回null) 
  // 是 100% 一致的！
  if (!isMounted) {
    return null; // 或者返回一个 <LoadingSpinner />
  }
  // --- 🚀 关键结束 ---


  // --- 只有在 isMounted 为 true 后，才会渲染下面的“真实”UI ---
  return (
    <main style={{ padding: '50px', textAlign: 'center' }}>
      <h1>我的“终极版” DApp</h1>
      <h3>(支持电脑和手机！)</h3>
      <hr style={{ margin: '30px 0' }} />

      <button 
        onClick={() => open()}
        style={{ fontSize: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '10px'}}
      >
        {/*
          因为有 'if (!isMounted)' 的保护, 
          这里的 'isConnected' 100% 是 Hydration 之后
          最准确的客户端状态！
        */}
        {isConnected ? `已连接 (${chain?.name || '...'})` : "连接我的钱包"}
      </button>

      {/* 这个检查也是 100% 安全的 */}
      {isConnected && address && (
        <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '20px' }}>
          <h2>🎉 连接成功!</h2>
          
          <p><strong>你的钱包地址:</strong> {address}</p>

          <p><strong>你的网络:</strong> {chain?.name}</p>

          {bnbBalance && (
            <p><strong>你的 BNB 余额:</strong> {bnbBalance.formatted} {bnbBalance.symbol}</p>
          )}

          {tokenBalance && (
            <p><strong>你的 USDT 余额:</strong> {tokenBalance.formatted} {tokenBalance.symbol}</p>
          )}
        </div>
      )}
    </main>
  );
}