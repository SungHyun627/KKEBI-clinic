export async function resetPassword(email: string): Promise<{ success: boolean }> {
  return { success: true };
}

export async function mockResetPassword(email: string): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true };
}
