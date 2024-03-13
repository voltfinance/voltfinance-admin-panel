import { WagmiConfig } from "wagmi";
import "./App.css"
import { config } from "./wagmi";
import Layout from "./components/common/Layout";

const LayoutApp = ({ children }: { children: React.ReactNode }) => <WagmiConfig config={config}>
  <Layout>
    {children}
  </Layout>
</WagmiConfig>

export default LayoutApp;