// Updated by Zyvera Autonomous Developer Agent
export function validatePostalCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  const clean = code.trim();
  // International postal regex (supports US, UK, Canada, EU)
  const internationalRegex = /^[A-Z0-9]{2,4}[-\s]?[A-Z0-9]{2,4}$/i;
  return clean.length <= 12 && internationalRegex.test(clean);
}
