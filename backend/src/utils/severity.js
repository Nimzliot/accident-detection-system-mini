const SEVERITY_MAP = {
  1: { level: 1, label: "Level 1", key: "MINOR", color: "green", priority: "low" },
  2: { level: 2, label: "Level 2", key: "MEDIUM", color: "yellow", priority: "medium" },
  3: { level: 3, label: "Level 3", key: "SEVERE", color: "red", priority: "critical" }
};

const STRING_TO_LEVEL = {
  MINOR: 1,
  MEDIUM: 2,
  SEVERE: 3,
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  "LEVEL 1": 1,
  "LEVEL 2": 2,
  "LEVEL 3": 3
};

export const calculateSeverity = ({
  acceleration = 0,
  tiltAngle = 0,
  gyroscopeMagnitude = 0
}) => {
  const impactMs2 = Number(acceleration);
  const tiltScore = Math.abs(Number(tiltAngle));
  const gyroScore = Math.abs(Number(gyroscopeMagnitude));

  let level = 1;

  if (impactMs2 >= 18 || tiltScore >= 45 || gyroScore >= 300) {
    level = 3;
  } else if (impactMs2 >= 12 || tiltScore >= 25 || gyroScore >= 180) {
    level = 2;
  }

  return {
    ...SEVERITY_MAP[level]
  };
};

export const buildSeveritySummary = (level) => SEVERITY_MAP[level] ?? SEVERITY_MAP[1];

export const normalizeSeverityInput = (value) => {
  if (typeof value === "string") {
    return STRING_TO_LEVEL[value.toUpperCase()] ?? 0;
  }

  const numericLevel = Number(value);
  return Number.isFinite(numericLevel) ? numericLevel : 0;
};
