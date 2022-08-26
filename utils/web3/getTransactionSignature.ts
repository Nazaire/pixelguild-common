import { PublicKey, Transaction } from "@solana/web3.js";
import { find } from "lodash";

export function getTransactionSignature(tx: Transaction, publicKey: PublicKey) {
  const buffer = find(tx.signatures, (sig) =>
    sig.publicKey.equals(publicKey)
  )!.signature;
  return buffer;
}
