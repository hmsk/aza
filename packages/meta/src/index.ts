import { readFileSync } from 'fs'
import { join } from 'path'

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

interface AzaMetaWithName extends AzaMeta {
  name: string
}

const address: AzaTree = JSON.parse(readFileSync(join(__dirname, 'japanese-addresses.json'), 'utf-8'))

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
const searchTerm = '下到津'
const closestTree = walkTree(address, searchTerm.split(''))
console.log('search with:', searchTerm)
console.log(gatherLeafs(closestTree).map((leaf) => ({ ...leaf, name: searchTerm + leaf.name })))
