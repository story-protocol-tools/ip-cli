import { Command } from 'commander'
import inquirer from 'inquirer'
import { setEnvValue, getEnvValue } from '../utils/config'

export const initCommand = new Command('init')
  .description('Initialize configuration for the Story CLI')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'privateKey',
        message: 'Enter your Story Network Testnet wallet PRIVATE KEY (hex without 0x):',
        default: getEnvValue('WALLET_PRIVATE_KEY') || '',
      },
      {
        type: 'input',
        name: 'pinataJwt',
        message: 'Enter your Pinata JWT:',
        default: getEnvValue('PINATA_JWT') || '',
      },
      {
        type: 'input',
        name: 'rpcUrl',
        message: 'Enter your preferred RPC URL:',
        default: getEnvValue('RPC_PROVIDER_URL') || 'https://rpc.odyssey.storyrpc.io',
      },
    ])

    // Store them in .env
    setEnvValue('WALLET_PRIVATE_KEY', answers.privateKey.trim())
    setEnvValue('PINATA_JWT', answers.pinataJwt.trim())
    setEnvValue('RPC_PROVIDER_URL', answers.rpcUrl.trim())

    console.log('Configuration saved to .env.')
  })
