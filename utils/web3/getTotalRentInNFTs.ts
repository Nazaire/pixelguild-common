import {
  findMetadataPda,
  findMasterEditionV2Pda,
} from "@metaplex-foundation/js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { flatMap, reduce } from "lodash";

async function getTotalRentInNfts(
  connection: Connection,
  mints: PublicKey[],
  owner: PublicKey
) {
  const publicKeys = flatMap(
    mints.map((mint) => [
      new PublicKey(mint),
      getAssociatedTokenAddressSync(mint, owner),
      findMetadataPda(mint),
      findMasterEditionV2Pda(mint),
    ])
  );

  const accounts = await connection.getMultipleAccountsInfo(publicKeys);

  return reduce(
    accounts,
    (total, account) => total + (account?.lamports || 0),
    0
  );
}
