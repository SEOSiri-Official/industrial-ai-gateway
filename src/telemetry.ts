import crypto from 'crypto';

export interface ENoseReading {
  sensor_array_id: string;
  voc_index: number;
  ethanol_ppm: number;
  co2_equivalent_ppm: number;
  humidity_rh: number;
  anomaly_detected: boolean;
}

export interface BiometricIoTAuth {
  subject_id: string;
  biometric_token_hash: string;
  sliding_window_valid: boolean;
  operator_clearance_level: 'OPERATOR' | 'SUPERVISOR' | 'SYSTEM_ARCHITECT';
}

export function vectorizeTelemetryStream(readings: number[]): { mean: number; min: number; max: number; variance: number; trend: 'RISING' | 'STABLE' | 'FALLING' } {
  if (readings.length === 0) return { mean: 0, min: 0, max: 0, variance: 0, trend: 'STABLE' };
  
  const sum = readings.reduce((a, b) => a + b, 0);
  const mean = sum / readings.length;
  const min = Math.min(...readings);
  const max = Math.max(...readings);
  const variance = readings.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / readings.length;

  const firstThird = readings.slice(0, Math.floor(readings.length / 3));
  const lastThird = readings.slice(Math.floor((readings.length * 2) / 3));
  const firstMean = firstThird.reduce((a, b) => a + b, 0) / (firstThird.length || 1);
  const lastMean = lastThird.reduce((a, b) => a + b, 0) / (lastThird.length || 1);

  let trend: 'RISING' | 'STABLE' | 'FALLING' = 'STABLE';
  if (lastMean > firstMean * 1.05) trend = 'RISING';
  else if (lastMean < firstMean * 0.95) trend = 'FALLING';

  return {
    mean: Number(mean.toFixed(2)),
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    variance: Number(variance.toFixed(3)),
    trend
  };
}

export function processENoseOlfactoryData(rawChannels: number[]): ENoseReading {
  const avg = rawChannels.reduce((a, b) => a + b, 0) / (rawChannels.length || 1);
  const voc = avg * 1.42;
  const isAnomaly = voc > 350.0;

  return {
    sensor_array_id: "ENOSE-ARRAY-7X",
    voc_index: Number(voc.toFixed(1)),
    ethanol_ppm: Number((avg * 0.85).toFixed(2)),
    co2_equivalent_ppm: Number((400 + avg * 3.2).toFixed(1)),
    humidity_rh: 48.5,
    anomaly_detected: isAnomaly
  };
}

export function validateBiometricToken(token: string): BiometricIoTAuth {
  const isValid = token.startsWith("BIO_TOKEN_") && token.length > 20;
  return {
    subject_id: "OPERATOR-9912",
    biometric_token_hash: crypto.createHash('sha256').update(token).digest('hex').substring(0, 16),
    sliding_window_valid: isValid,
    operator_clearance_level: isValid ? 'SUPERVISOR' : 'OPERATOR'
  };
}
