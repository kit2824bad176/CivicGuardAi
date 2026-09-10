// In-memory rate limiting map for basic MVP security
// NOTE: For scale, use Redis or Upstash instead.
const rateLimitMap = new Map();

export function rateLimit(ip: string, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  const requestTimestamps = (rateLimitMap.get(ip) || []).filter((timestamp: number) => timestamp > windowStart);
  
  if (requestTimestamps.length >= limit) {
    return false;
  }
  
  requestTimestamps.push(now);
  rateLimitMap.set(ip, requestTimestamps);
  return true;
}
