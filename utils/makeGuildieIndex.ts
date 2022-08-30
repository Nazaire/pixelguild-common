import { GUILDIE_RANKS } from "@common/state/ranks";
import { IGuildieInfo } from "../types/IGuildieInfo";

export type GuildieIndex = Map<string, IGuildieInfo>;

export function makeGuildieIndex(): GuildieIndex {
  const index: GuildieIndex = new Map();
  for (const mint in GUILDIE_RANKS) {
    index.set(mint, GUILDIE_RANKS[mint]);
  }

  return index;
}
