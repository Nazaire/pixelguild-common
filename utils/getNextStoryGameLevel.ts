import { indexOf } from "lodash";
import { StoryGameLevelIdentifier } from "../types/StoryGameLevelIdentifier.enum";
import { StoryGameLevelSequence } from "./StoryGameLevelSequence";

export function getNextStoryGameLevel(level: StoryGameLevelIdentifier) {
  const i = indexOf(StoryGameLevelSequence, level);

  return StoryGameLevelSequence[i + 1];
}
