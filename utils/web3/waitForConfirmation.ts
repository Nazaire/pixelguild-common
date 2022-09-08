import {
  BlockheightBasedTransactionConfirmationStrategy,
  Commitment,
  Connection,
} from "@solana/web3.js";
import AsyncRetry from "async-retry";

export async function waitForConfirmation(
  connection: Connection,
  strategy: BlockheightBasedTransactionConfirmationStrategy,
  options?: {
    commitment?: Commitment;
    retry?: AsyncRetry.Options;
  }
) {
  return await AsyncRetry(async () => {
    return await connection.confirmTransaction(strategy, options?.commitment);
  }, options?.retry);
}
