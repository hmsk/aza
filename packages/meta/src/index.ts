import { readFileSync } from 'fs'
import { join } from 'path'

const address = JSON.parse(readFileSync(join(__dirname, 'japanese-addresses.json'), 'utf-8'))
console.log(address)
