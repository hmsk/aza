// @ts-ignore
import { addresses } from './vendor.js'

export type AzaTree = {
  [branch: string]: AzaTree
} & {
  leaf?: AzaMeta
}

export interface AzaMeta {
  id: string
  latitude: number
  longitude: number
}

export interface AzaMetaWithName extends AzaMeta {
  name: string
}

const walkTree = (tree: AzaTree, [head, ...rest]: string[]): AzaTree => {
  if (tree[head]) {
    return walkTree(tree[head], rest)
  } else {
    return tree
  }
}

const gatherLeafs = (tree: AzaTree): AzaMetaWithName[] => {
  const results: AzaMetaWithName[] = []
  Object.keys(tree).forEach(key => {
    if (key === 'leaf') {
      results.push({ ...tree.leaf as AzaMeta, name: '' })
    } else {
      results.push(...gatherLeafs(tree[key]).map(leaf => ({ ...leaf, name: key + leaf.name })))
    }
  })
  return results
}

export const search = (term: string): AzaMetaWithName[] => {
  const closestTree = walkTree(addresses as AzaTree, term.split(''))
  if (Object.keys(closestTree).length === Object.keys(addresses).length) return []
  return gatherLeafs(closestTree).map((leaf) => ({ ...leaf, name: term + leaf.name }))
}
