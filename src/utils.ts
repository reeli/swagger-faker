export const pickRefKey = (str: string | undefined) => {
  if (!str) {
    return "";
  }
  const list = str.split("/");
  return list[list.length - 1];
};
