import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

export const getTokenAccountsByOwner = async (
  connection: Connection,
  owner: PublicKey
) => {
  const tokens = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  return tokens.value
    .filter(({ account }) => account.data.parsed.info.tokenAmount.uiAmount > 0)
    .sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()));
};
