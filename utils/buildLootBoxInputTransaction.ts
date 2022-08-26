import { getLootBoxConfig } from "@common/state/lootBoxes";
import { LootBoxId } from "@common/types/LootBoxConfig";
import {
  createBurnInstruction,
  createCloseAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { get } from "lodash";
import { resolveTokenAccounts } from "@common/utils/web3/resolveTokenAccounts";

export type LootBoxInputRaw =
  | {
      mint: PublicKey;
      tokenAccount: PublicKey;
      owner: PublicKey;
      amount: number;

      method: "burn";
    }
  | {
      mint: PublicKey;
      tokenAccount: PublicKey;
      owner: PublicKey;
      amount: number;

      method: "burn-and-close";
      authority: PublicKey;
    }
  | {
      mint: PublicKey;
      tokenAccount: PublicKey;
      owner: PublicKey;
      destinationTokenAccount: PublicKey;
      amount: number;
      method: "transfer";
    };

export function createLootBoxInputTransactionFromRaw(
  input: LootBoxInputRaw[],
  payer: PublicKey,
  authority: PublicKey
) {
  const transaction = new Transaction();

  // take a small amount of SOL to cover the cost of sending the reward back to the user
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: authority,
      lamports: 0.001 * LAMPORTS_PER_SOL,
    })
  );

  for (const item of input) {
    if (item.method === "burn" || item.method === "burn-and-close") {
      transaction.add(
        createBurnInstruction(
          item.tokenAccount,
          item.mint,
          item.owner,
          item.amount
        )
      );
      if (item.method === "burn-and-close") {
        // close the Token Account as well.
        transaction.add(
          createCloseAccountInstruction(
            item.tokenAccount,
            (item as any).destination!,
            item.owner
          )
        );
      }
    } else if (item.method === "transfer") {
      transaction.add(
        createTransferInstruction(
          item.tokenAccount,
          item.destinationTokenAccount,
          item.owner,
          item.amount
        )
      );
    }
  }

  return transaction;
}

export async function buildLootBoxInputTransaction(
  id: LootBoxId,
  params: {
    /**
     * The user's walletF
     */
    owner: PublicKey;
    /**
     * The application's wallet
     */
    authority: PublicKey;

    /**
     * Mint ID's for creator based inputs
     */
    inputs?: { mint: PublicKey }[];
  }
): Promise<Transaction> {
  const config = getLootBoxConfig(id);

  const sources = await resolveTokenAccounts(
    params.owner,
    config.inputs.map((input, index): PublicKey => {
      if (input.creator) {
        return new PublicKey(params.inputs![index]);
      } else if (input.mint) {
        return new PublicKey(input.mint);
      } else {
        throw "unknown error 999";
      }
    })
  );

  const destinations = await resolveTokenAccounts(
    params.authority,
    config.inputs
      .filter((i) => i.method === "transfer")
      .map((i) => new PublicKey(i.mint!))
  );

  const instructions: LootBoxInputRaw[] = [];

  for (let i = 0; i < config.inputs.length; i++) {
    const input = config.inputs[i];

    let mint: PublicKey;

    // let tokenAccount =
    if (input.creator) {
      const option = get(params?.inputs, i);

      if (!option)
        throw `Mint option not given for creator: ${input.creator.toString()} at input index: ${i}`;

      mint = option.mint;
    } else if (input.mint) {
      mint = new PublicKey(input.mint);
    } else {
      throw `Invalid coniguration for lootbox ${id}`;
    }

    if (input.method === "burn") {
      instructions.push({
        mint,
        tokenAccount: sources[mint.toString()],
        owner: params.owner,
        amount: input.amount,
        authority: params.authority,
        method: input.creator ? "burn-and-close" : "burn",
      });
    } else if (input.method === "transfer") {
      instructions.push({
        mint,
        tokenAccount: sources[mint.toString()],
        owner: params.owner,
        destinationTokenAccount: destinations[mint.toString()],
        amount: input.amount,
        method: "transfer",
      });
    }
  }

  return createLootBoxInputTransactionFromRaw(
    instructions,
    params.owner,
    params.authority
  );
}
