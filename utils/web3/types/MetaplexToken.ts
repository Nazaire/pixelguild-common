import {
  MetadataAccount,
  OriginalOrPrintEditionAccountData,
} from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { RawMint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { find, get, some } from "lodash";
import { trimNull } from "@common/utils/trimNull";

/**
 * A Token
 */
export interface IMetaplexToken {
  id: string;

  mintAddress: PublicKey;

  // mint: RawMint | null;
  metadata: MetadataAccount["data"] | null;
  edition: OriginalOrPrintEditionAccountData | null;

  externalMetadata?: any;
}

/**
 * A NFT with helpers
 */
export class MetaplexToken implements IMetaplexToken {
  constructor(data: IMetaplexToken) {
    this.id = data.id;
    this.mintAddress = data.mintAddress;
    // this.mint = data.mint;
    this.metadata = data.metadata;
    this.edition = data.edition;
    this.externalMetadata = data.externalMetadata;
  }

  id: string;
  mintAddress: PublicKey;
  // mint: RawMint | null;
  metadata: MetadataAccount["data"] | null;
  edition: OriginalOrPrintEditionAccountData | null;
  externalMetadata?: any;

  get name(): string | null {
    return trimNull(get(this.externalMetadata, "name")) || null;
  }

  get symbol(): string | null {
    return trimNull(get(this.metadata, "data.symbol")) || null;
  }

  get description(): string | null {
    return trimNull(get(this.externalMetadata, "description")) || null;
  }

  get image(): string | null {
    return trimNull(get(this.externalMetadata, "image")) || null;
  }

  public hasVerifiedCreator(creator: string) {
    if (!this.metadata?.data.creators) return false;

    return some(
      this.metadata.data.creators,
      (c) => c.address.toString() === creator && c.verified
    );
  }

  get standard() {
    return this.metadata?.tokenStandard;
  }

  isTokenStandard(standard: TokenStandard) {
    return this.metadata?.tokenStandard === standard;
  }

  get attributes() {
    if (!this.externalMetadata?.attributes) return [];

    return this.externalMetadata.attributes as {
      trait_type: string;
      value: string;
    }[];
  }

  attribute(traitType: string) {
    return find(this.attributes, { trait_type: traitType })?.value || null;
  }
}
