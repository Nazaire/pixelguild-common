import { RawAccount, RawMint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export interface ITokenAccount {
  id: string;
  publicKey: PublicKey;
  account: RawAccount;
  mint: RawMint;
}

export class TokenAccount implements ITokenAccount {
  constructor(data: ITokenAccount) {
    this.id = data.id;
    this.publicKey = data.publicKey;
    this.account = data.account;
    this.mint = data.mint;
  }

  id: string;
  publicKey: PublicKey;
  account: RawAccount;
  mint: RawMint;

  get amount() {
    return this.account.amount;
  }

  get supply() {
    return this.mint.supply;
  }

  get mintAddress() {
    return this.account.mint;
  }
}
