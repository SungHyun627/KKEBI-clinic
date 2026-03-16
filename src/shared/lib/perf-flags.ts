export const isLighthouseBypassAuthEnabled = () =>
  process.env.NEXT_PUBLIC_LH_BYPASS_AUTH === 'true';
