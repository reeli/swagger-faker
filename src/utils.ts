export const pickRefKey = (str: string) => {
  if (!str) {
    return "";
  }
  const list = str.split("/");
  return list[list.length - 1];
};
