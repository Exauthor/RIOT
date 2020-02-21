
import { execSync } from 'child_process'

export const getMemory = function() {
  let totalMemory: number = parseFloat(execSync('free | awk \'/Mem/{printf("%d"), $2}\'').toString('utf8'))
  let usedMemory: number = parseFloat(execSync('free | awk \'/Mem/{printf("%d"), $3}\'').toString('utf8'))
  let percentUsedMemory: number = usedMemory / (totalMemory / 100)

  return { 'percentUsedMemory': Math.ceil(percentUsedMemory), 'usedMemory': usedMemory, 'totalMemory': totalMemory }
}

export const getCpuTemperature = function() {
  const temperature = parseFloat(execSync('echo $(($(</sys/class/thermal/thermal_zone0/temp) / 1000))').toString('utf8'))

  return { temperature }
}

export const getCurrentVolume = function() {
  const volume = parseFloat(execSync(`awk -F"[][]" '/dB/ { print $2 }' <(amixer sget Master)`).toString('utf8'))

  return { volume }
}

export const updateVolume = function(volume: number) {
  const volumeAnswer = parseFloat(execSync(`awk -F"[][]" '/dB/ { print $2 }' <(amixer set Master ${volume}%)`).toString('utf8'))
  return volumeAnswer
}
