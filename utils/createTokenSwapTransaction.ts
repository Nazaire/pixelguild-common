import {
  createMintToInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { ITokenSwapConfig } from "@common/types/TokenSwapConfig";

/**
 * Constructs a transaction from a token swap config
 * @param id
 * @param user
 * @returns
 */
export async function createTokenSwapTransaction(
  config: ITokenSwapConfig,
  user: PublicKey
) {
  const { input, output } = config;

  console.log(`Creating token swap transaction`, {
    // config,
    input,
    output,
    user,
  });

  const tx = new Transaction();

  tx.feePayer = new PublicKey(user);

  if (input.type === "transfer") {
    if (!input.destination)
      throw `TokenSwapConfig uses transfer input but destination is not defined.`;
    const mint = new PublicKey(input.token);
    const source = await getAssociatedTokenAddress(mint, user);
    const destination = await getAssociatedTokenAddress(
      mint,
      new PublicKey(input.destination)
    );
    tx.add(createTransferInstruction(source, destination, user, input.amount));
  } else {
    throw "Not supported method yet";
  }

  if (output.source.type === "mint") {
    const mint = new PublicKey(output.token);
    const destination = await getAssociatedTokenAddress(mint, user);

    tx.add(
      createMintToInstruction(
        mint,
        destination,
        new PublicKey(output.source.authority),
        output.amount
      )
    );
  } else {
    throw "Not supported pool source yet.";
  }

  return tx;
}
