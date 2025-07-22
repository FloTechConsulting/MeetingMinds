export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const getCurrentTimestamp = (): Date => {
  return new Date();
};