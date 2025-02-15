
// call the api route for cost

export const getCost = async (): Promise<number> => {
  const response = await fetch("/api/cost");
  const data = await response.json();
  return data.cost;
};
