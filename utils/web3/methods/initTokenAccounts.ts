import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { buildCreateManyTokenAccounts } from "../instructions/buildCreateManyTokenAccounts";

export async function initTokenAccounts(
  connection: Connection,
  mints: PublicKey[],
  owner: PublicKey,
  payer: PublicKey
) {
  const accountsToCreate: { mint: PublicKey; account: PublicKey }[] = [];
  for (const { mint, account } of mints.map((mint) => ({
    mint,
    account: getAssociatedTokenAddressSync(mint, owner),
  }))) {
    if (!(await connection.getAccountInfo(account))) {
      accountsToCreate.push({ mint, account });
    }
  }

  if (accountsToCreate.length > 0) {
    const tx = new Transaction();
    const { blockhash, lastValidBlockHeight } =
      await await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight;

    tx.instructions.push(
      ...accountsToCreate.map(({ mint, account }) =>
        createAssociatedTokenAccountInstruction(payer, account, owner, mint)
      )
    );

    return tx;
  } else {
    return null;
  }
}
