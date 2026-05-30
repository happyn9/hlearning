import { programs } from "../data/programs";
import { likesMap } from "../data/likesMap";

export function getRecommendedPrograms(userLikes = []) {
  if (!userLikes.length) return [];

  const likedTags = new Set(
    userLikes.flatMap(like => likesMap[like] || [])
  );

  return programs
    .map(program => {
      const score = program.tags.reduce(
        (acc, tag) => acc + (likedTags.has(tag) ? 1 : 0),
        0
      );

      return { ...program, score };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score);
}
