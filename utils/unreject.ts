export const unreject = <T>(p: Promise<T>): Promise<T | Error> => {
  return p.catch((error) => error);
};
