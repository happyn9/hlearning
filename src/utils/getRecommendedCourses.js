import { courses } from "../data/coursesData";
import { likesMap } from "../data/likesMap";

export function getRecommendedCourses(user) {
  if (!user?.academic?.program) return [];

  const { program, year, semester } = user.academic;
  const likes = user.onboarding.likes;

  // 1️⃣ Cours du programme + année + semestre
  let filtered = courses.filter(
    c =>
      c.program === program &&
      c.year === year &&
      c.semester === semester
  );

  // 2️⃣ Si likes → prioriser
  if (likes.length > 0) {
    filtered = filtered.sort((a, b) => {
      const aScore = likes.some(like =>
        likesMap[like]?.some(tag =>
          a.title.toLowerCase().includes(tag.toLowerCase())
        )
      ) ? 1 : 0;

      const bScore = likes.some(like =>
        likesMap[like]?.some(tag =>
          b.title.toLowerCase().includes(tag.toLowerCase())
        )
      ) ? 1 : 0;

      return bScore - aScore;
    });
  }

  return filtered;
}
