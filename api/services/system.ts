
import { execSync } from 'child_process'

export const getMemory = function() {
  let totalMemory: number = parseFloat(execSync('free | awk \'/Mem/{printf("%d"), $2}\'').toString('utf8'))
  let usedMemory: number = parseFloat(execSync('free | awk \'/Mem/{printf("%d"), $3}\'').toString('utf8'))
  let percentUsedMemory: number = usedMemory / (totalMemory / 100)

  return { 'percentUsedMemory': Math.ceil(percentUsedMemory), 'usedMemory': usedMemory, 'totalMemory': totalMemory }
}
