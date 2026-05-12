/** Arabic-Indic (٠–٩) and Persian (۰–۹) to Western ASCII 0–9. */
export function toWesternDigits(value: string): string {
  return value.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, (ch) =>
    String(ch.charCodeAt(0) & 0xf),
  );
}
