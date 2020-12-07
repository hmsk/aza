/// <reference types="next" />
/// <reference types="next/types/global" />

import { FunctionComponent } from "react"

declare module "*.md" {
  export const attributes: Record<string, unknown>
  export const react: FunctionComponent
  export const html: string
  export const body: string
}
