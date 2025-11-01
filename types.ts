
export enum ButtonCategory {
  NUMBER,
  OPERATOR,
  FUNCTION,
  SPECIAL,
  GEMINI,
}

export interface ButtonConfig {
  label: string;
  value: string;
  category: ButtonCategory;
  span?: string;
}
