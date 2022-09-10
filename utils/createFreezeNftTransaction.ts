import { findMasterEditionV2Pda } from "@metaplex-foundation/js";
import { createFreezeDelegatedAccountInstruction } from "@metaplex-foundation/mpl-token-metadata";
import { createApproveInstruction } from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

/**
 * not used
 * @param params
 * @returns
 */
export function createFreezeNftTransaction(params: {
  connection: Connection;
  blockHash: string;
  owner: string;
  mint: string;
  // edition: string;
  tokenAccount: string;
  delegate: string;
}) {
  const owner = new PublicKey(params.owner);
  const mint = new PublicKey(params.mint);
  const delegate = new PublicKey(params.delegate);
  const tokenAccount = new PublicKey(params.tokenAccount);
  const edition = findMasterEditionV2Pda(mint);

  const tx = new Transaction();
  tx.feePayer = owner;
  tx.recentBlockhash = params.blockHash;

  tx.add(
    createApproveInstruction(tokenAccount, delegate, owner, 1),
    createFreezeDelegatedAccountInstruction({
      delegate,
      tokenAccount,
      edition,
      mint,
    })
  );

  return tx;
}
