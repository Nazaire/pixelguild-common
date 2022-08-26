import {
  Cluster as SolanaCluster,
  clusterApiUrl,
  Commitment,
  Connection,
  ConnectionConfig,
} from "@solana/web3.js";

export type Cluster = SolanaCluster | "localnet";

export const cluster = (process.env.APP_CLUSTER as Cluster) || "devnet";
export const url = (() => {
  switch (cluster) {
    case "localnet":
      return process.env.APP_LOCALNET_URL || "http://localhost:8899";
    case "devnet":
      return process.env.APP_DEVNET_URL || clusterApiUrl(cluster);
    case "testnet":
      return process.env.APP_TESTNET_URL || clusterApiUrl(cluster);
    case "mainnet-beta":
      return process.env.APP_MAINNET_URL || clusterApiUrl(cluster);
    default:
      return clusterApiUrl(cluster);
  }
})();
export function getConnection(
  commitmentOrConfig?: Commitment | ConnectionConfig
) {
  return new Connection(url, commitmentOrConfig);
}
