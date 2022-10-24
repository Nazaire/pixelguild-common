import { useAccount } from "@common/state/accounts";
import { PixelGuildAccount } from "@common/types/PixelGuildAccount.enum";
import {
  createCloseAccountInstruction,
  createMintToInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";

export const GOLD_PER_GOLDEN_KEY = 5_000;

/**
 * Build a transaction to mint GOLD for transferring golden keys
 * @param mints
 * @param owner
 * @returns
 */
export function createGoldenKeyBurnTransaction(
  mints: PublicKey[],
  owner: PublicKey
) {
  const transaction = new Transaction();
  const gold = useAccount(PixelGuildAccount.GOLD);

  transaction.add(
    createMintToInstruction(
      gold,
      getAssociatedTokenAddressSync(gold, owner),
      useAccount(PixelGuildAccount.AUTHORITY),
      GOLD_PER_GOLDEN_KEY * mints.length
    )
  );

  for (const mint of mints) {
    // we assume these are nft accounts with an amount of 1
    transaction.add(
      createTransferInstruction(
        getAssociatedTokenAddressSync(mint, owner),
        getAssociatedTokenAddressSync(
          mint,
          useAccount(PixelGuildAccount.DRAIN)
        ),
        owner,
        1
      ),
      createCloseAccountInstruction(
        getAssociatedTokenAddressSync(mint, owner),
        useAccount(PixelGuildAccount.DRAIN),
        owner
      )
    );
  }

  return transaction;
}
