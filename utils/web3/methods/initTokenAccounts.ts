import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { zip } from "lodash";

export async function initTokenAccounts(params: {
  connection: Connection;
  mints: PublicKey[];
  owner: PublicKey;
  payer: PublicKey;
  blockHash?: string;
}) {
  const accountsToCreate: { mint: PublicKey; account: PublicKey }[] = [];

  const accounts = await params.connection.getMultipleAccountsInfo(
    params.mints.map((mint) =>
      getAssociatedTokenAddressSync(mint, params.owner)
    )
  );

  for (const [mint, account] of zip(params.mints, accounts)) {
    if (!account) {
      accountsToCreate.push({
        mint: mint!,
        account: getAssociatedTokenAddressSync(mint!, params.owner),
      });
    }
  }
  if (accountsToCreate.length > 0) {
    const tx = new Transaction();
    tx.feePayer = params.payer;

    if (params.blockHash) {
      tx.recentBlockhash = params.blockHash;
    } else {
      const { blockhash, lastValidBlockHeight } =
        await params.connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;
    }

    console.log(`Creating token accounts...`, accountsToCreate);

    tx.instructions.push(
      ...accountsToCreate.map(({ mint, account }) =>
        createAssociatedTokenAccountInstruction(
          params.payer,
          account,
          params.owner,
          mint
        )
      )
    );

    return tx;
  } else {
    return null;
  }
}
