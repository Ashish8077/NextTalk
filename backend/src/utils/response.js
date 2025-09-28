export const sendResponse = (res, code, { success, message, data }) => {
  const response = {
    ...(success && Boolean(success)),
    ...(message && { message }),
    ...(data && { data }),
  };
  return res.status(code).json(response);
};
