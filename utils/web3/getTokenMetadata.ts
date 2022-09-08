import { findMetadataPda, parseMetadataAccount } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";

export async function getTokenMetadata(
  connection: Connection,
  mint: PublicKey
) {
  const metadataPda = findMetadataPda(mint);

  const account = await connection.getAccountInfo(metadataPda);

  const metadata = parseMetadataAccount(account as any).data;

  return metadata;
}
