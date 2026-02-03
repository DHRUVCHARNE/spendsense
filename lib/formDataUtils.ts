export function formDataToNestedObject(formData: FormData) {
  const obj: any = {};

  for (const [key, value] of formData.entries()) {
    const parts = key.split(".");
    let current = obj;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        current[part] = value;
      } else {
        current[part] ??= {};
        current = current[part];
      }
    }
  }

  return obj;
}
