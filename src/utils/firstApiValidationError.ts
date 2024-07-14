export default function firstApiValidationError(errorObject = {}) {
  const errorKeys = Object.keys(errorObject);
  if (!errorKeys) return;
  return errorObject[errorKeys[0] as keyof typeof errorObject];
}
