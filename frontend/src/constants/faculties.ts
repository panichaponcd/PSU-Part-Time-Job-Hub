/**
 * Canonical list of Prince of Songkla University (PSU) Phuket faculties.
 */
export const PSU_FACULTIES = [
  'College of Computing',
  'Faculty of Hospitality and Tourism',
  'Faculty of International Studies',
  'Faculty of Technology and Environment',
] as const;

export type PsuFaculty = (typeof PSU_FACULTIES)[number];

export const RELIGION_OPTIONS = [
  'Buddhism',
  'Islam',
  'Christianity',
  'Hinduism',
  'Sikhism',
  'Other / Prefer not to say',
] as const;
