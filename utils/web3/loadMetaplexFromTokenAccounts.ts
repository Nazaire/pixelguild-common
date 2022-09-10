import { zip } from "lodash";
import { MetaplexTokenRepo } from "./createMetaplexTokenRepo";
import { TokenAccount } from "./types/TokenAccount";

export async function loadMetaplexFromTokens(params: {
  tokens: TokenAccount[];
  metaplexRepo: MetaplexTokenRepo;
}) {
  const metaplex = await params.metaplexRepo.loadMany(
    params.tokens.map((t) => t.mintAddress.toString())
  );

  const zipped = zip(params.tokens, metaplex);

  return zipped.map(([token, metaplex]) => ({
    token,
    metaplex,
  }));
}
