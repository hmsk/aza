/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.md' {
  export const attributes: Record<string, unknown>
  export const react: React.FC
  export const html: string
  export const body: string
}
