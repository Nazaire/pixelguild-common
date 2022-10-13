import { TOKEN_PROGRAM_ID, unpackAccount } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

export const getTokenAccountsByOwner2 = async (
  connection: Connection,
  owner: PublicKey
) => {
  const tokens = await connection.getTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  return tokens.value
    .sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()))
    .map(({ pubkey, account }) => unpackAccount(pubkey, account));
};
