import {
  Cluster as SolanaCluster,
  clusterApiUrl,
  Commitment,
  Connection,
  ConnectionConfig,
} from "@solana/web3.js";

export type Cluster = SolanaCluster | "localnet";

export const getClusterUrl = (value: Cluster = cluster) => {
  switch (value) {
    case "localnet":
      return process.env.APP_LOCALNET_URL || "http://localhost:8899";
    case "devnet":
      return process.env.APP_DEVNET_URL || clusterApiUrl(value);
    case "testnet":
      return process.env.APP_TESTNET_URL || clusterApiUrl(value);
    case "mainnet-beta":
      return process.env.APP_MAINNET_URL || clusterApiUrl(value);
    default:
      return clusterApiUrl(value);
  }
};

export const cluster = (process.env.APP_CLUSTER as Cluster) || "devnet";
export const clusterUrl = getClusterUrl(cluster);

export function getConnection(
  commitmentOrConfig?: Commitment | ConnectionConfig
) {
  return new Connection(clusterUrl, commitmentOrConfig);
}
