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
  return await AsyncRetry(
    async () => {
      const result = await connection.getTransaction(strategy.signature, {
        commitment: "confirmed",
      });
      if (!result) throw new Error("Transaction couldn't be confirmed");
    },
    {
      retries: 5,
      ...options?.retry,
    }
  );
}
