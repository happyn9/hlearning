export function hasAccess(user, item) {
  if (!item?.premium) return true;
  return user?.subscription === "premium";
}
