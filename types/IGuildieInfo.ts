export class IGuildieInfo {
  mintAddress!: string;

  name!: string;

  race!: string;

  rank!: number;

  rarity!:
    | "king"
    | "mythic"
    | "legendary"
    | "epic"
    | "rare"
    | "uncommon"
    | "common";

  raceRank!: number;

  capabilities!: "ascension"[];
}
