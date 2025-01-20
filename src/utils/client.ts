import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { privateKeyToAccount, Account, Address } from 'viem/accounts'
import { requireEnv } from './config'

let client: StoryClient | null = null
let account: Account | null = null

export function getClient(): StoryClient {
  if (client) return client

  const privateKey = requireEnv('WALLET_PRIVATE_KEY')
  const rpcUrl = requireEnv('RPC_PROVIDER_URL')

  account = privateKeyToAccount(`0x${privateKey}`)

  const config: StoryConfig = {
    account: account,
    transport: http(rpcUrl),
    chainId: 'odyssey',
  }

  client = StoryClient.newClient(config)
  return client
}

export function getAccount(): Account {
  if (!account) {
    // If for some reason not set yet, load it
    getClient()
    if (!account) {
      throw new Error('No account found. Check WALLET_PRIVATE_KEY is valid.')
    }
  }
  return account
}
