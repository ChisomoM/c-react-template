export const submitContactMessage = async (data: any) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Message submitted:", data);
      resolve({ success: true });
    }, 1000);
  });
};
