// 文件名: app/wagmi-config.ts

// 1. 导入工具
import { createConfig, http } from 'wagmi';
import { bsc } from 'wagmi/chains'; // 导入 BNB Smart Chain
import { createWeb3Modal } from '@web3modal/wagmi/react';

// 2. ❗❗ 把这里换成你自己的 Project ID ❗❗
const projectId = 'd95d2c6bda71cb24fc34cecf90f60f5e'; // 你的 Project ID

// 3. 配置你的 DApp 支持哪些链
// 我们在这里只配置了 bsc (BNB Smart Chain)
const metadata = {
  name: 'My Wallet App',
  description: 'My first DApp',
  url: 'https://my-wallet-app-eight.vercel.app', // 你的 Vercel 网址
  icons: ['https://my-wallet-app-eight.vercel.app/favicon.ico'] // 你的图标
};

// ... (metadata 定义) ...

export const wagmiConfig = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http()
  },
  // <-- ✅ 这里的 metadata, 已经被删除了
});

createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
  metadata, // <-- ✅ 把 metadata, 添加到这里！
  enableAnalytics: true,
  enableOnramp: true
});