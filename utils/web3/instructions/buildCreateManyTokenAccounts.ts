import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export function buildCreateManyTokenAccounts(
  mints: PublicKey[],
  owner: PublicKey,
  payer: PublicKey
) {
  return mints.map((mint) =>
    createAssociatedTokenAccountInstruction(
      payer,
      getAssociatedTokenAddressSync(mint, owner),
      owner,
      mint
    )
  );
}
