import * as fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const ENV_FILE_PATH = path.resolve(process.cwd(), '.env')

export const getEnvValue = (key: string): string | undefined => {
  return process.env[key]
}

// Update or create .env with the given key/value pair
export const setEnvValue = (key: string, value: string) => {
  // 1. Read existing .env
  let envConfig = ''
  if (fs.existsSync(ENV_FILE_PATH)) {
    envConfig = fs.readFileSync(ENV_FILE_PATH, 'utf-8')
  }

  // 2. If key exists, update; otherwise, append
  const keyRegex = new RegExp(`^${key}=.*$`, 'm')
  if (keyRegex.test(envConfig)) {
    // update
    envConfig = envConfig.replace(keyRegex, `${key}=${value}`)
  } else {
    // append
    if (envConfig.length > 0 && !envConfig.endsWith('\n')) {
      envConfig += '\n'
    }
    envConfig += `${key}=${value}\n`
  }

  // 3. Write it back
  fs.writeFileSync(ENV_FILE_PATH, envConfig)
}

// Provide a helper to get or fail if env missing
export const requireEnv = (key: string): string => {
  const value = getEnvValue(key)
  if (!value) {
    throw new Error(`Missing required ENV var: ${key}`)
  }
  return value
}
