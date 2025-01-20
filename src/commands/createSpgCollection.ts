import { Command } from 'commander'
import { zeroAddress } from 'viem'
import { getClient } from '../utils/client'
import { setEnvValue } from '../utils/config'

export const createSpgCollectionCommand = new Command('create-collection')
  .description('Create a new SPG NFT collection')
  .action(async () => {
    try {
      // Since Inquirer 9 is ESM only, if your project is still CommonJS,
      // you can dynamically import it inside an async function:
      const { default: inquirer } = await import('inquirer')

      // Prompt the user for collection details
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter the name for the NFT collection:',
          default: 'Test NFT',
        },
        {
          type: 'input',
          name: 'symbol',
          message: 'Enter the symbol for the NFT collection:',
          default: 'TEST',
        },
        {
          type: 'confirm',
          name: 'isPublicMinting',
          message: 'Is public minting allowed?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'mintOpen',
          message: 'Is the mint currently open?',
          default: true,
        },
        {
          type: 'input',
          name: 'mintFeeRecipient',
          message: 'Mint fee recipient address (enter 0x0 if none):',
          default: zeroAddress,
        },
        {
          type: 'input',
          name: 'contractURI',
          message: 'Enter a contract-level metadata URI (optional):',
          default: '',
        },
      ])

      const client = getClient()

      console.log('Creating new SPG NFT collection...')

      // Pass user inputs to createNFTCollection
      const newCollection = await client.nftClient.createNFTCollection({
        name: answers.name,
        symbol: answers.symbol,
        isPublicMinting: answers.isPublicMinting,
        mintOpen: answers.mintOpen,
        mintFeeRecipient: answers.mintFeeRecipient,
        contractURI: answers.contractURI,
        txOptions: { waitForTransaction: true },
      })

      console.log(`\nNew SPG NFT collection created!`)
      console.log(`Transaction Hash: ${newCollection.txHash}`)
      console.log(`NFT Contract Address: ${newCollection.spgNftContract}\n`)

      // Optionally store in .env
      setEnvValue('SPG_NFT_CONTRACT_ADDRESS', newCollection.spgNftContract!)
      console.log('Saved SPG_NFT_CONTRACT_ADDRESS to .env')
    } catch (error) {
      console.error(`Error creating SPG collection: ${(error as Error).message}`)
      process.exit(1)
    }
  })
