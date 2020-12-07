/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.md' {
  import { FunctionComponent } from 'react'

  export const attributes: Record<string, unknown>
  export const react: FunctionComponent
  export const html: string
  export const body: string
}
