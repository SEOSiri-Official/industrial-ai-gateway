import crypto from 'crypto';

const MASTER_SECRET = process.env.MASTER_SECRET || "seosiri_master_mcp_secret_key_2026_x99";

const HAZARDOUS_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /override\s+safety\s+interlocks?/i,
  /disable\s+(thermal|pressure|e-stop)\s+limit/i,
  /drop\s+table/i,
  /bypass\s+physical\s+guards?/i
];

export function sanitizeIndustrialPrompt(prompt: string): { safe: boolean; reason?: string } {
  for (const pattern of HAZARDOUS_PATTERNS) {
    if (pattern.test(prompt)) {
      return { safe: false, reason: `AI Firewall Alert: Prompt contains hazardous command override pattern [${pattern.source}]` };
    }
  }
  return { safe: true };
}

export function verifyTpmHardwareSignature(payload: string, signatureHex?: string): boolean {
  if (!signatureHex) return false;
  
  const expectedSig = crypto
    .createHmac('sha256', MASTER_SECRET)
    .update(payload)
    .digest('hex')
    .substring(0, 8);
    
  return signatureHex.toLowerCase() === expectedSig.toLowerCase();
}

export function anonymizeIndustrialTelemetry<T>(data: T): T {
  if (typeof data === 'string') {
    return data
      .replace(/\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})\b/g, '[REDACTED_FINANCIAL]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED_OPERATOR_EMAIL]')
      .replace(/\b(?:192\.168|10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b/g, '[INTERNAL_VLAN_IP]') as unknown as T;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => anonymizeIndustrialTelemetry(item)) as unknown as T;
  }
  
  if (data !== null && typeof data === 'object') {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      if (['password', 'secret', 'operator_ssn', 'pin'].includes(k.toLowerCase())) {
        clean[k] = '[REDACTED_CONFIDENTIAL]';
      } else {
        clean[k] = anonymizeIndustrialTelemetry(v);
      }
    }
    return clean as T;
  }
  
  return data;
}
