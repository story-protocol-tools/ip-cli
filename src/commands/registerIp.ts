import { Command } from 'commander'
import inquirer from 'inquirer'
import { createHash } from 'crypto'
import { Address } from 'viem'
import { getClient } from '../utils/client'
import { uploadJSONToIPFS } from '../utils/uploadToIpfs'
import { requireEnv } from '../utils/config'
import { IpMetadata } from '@story-protocol/core-sdk'

export const registerIpCommand = new Command('register-ip')
  .description('Mint an NFT and register it on Story in a single transaction.')
  .action(async () => {
    try {
      const client = getClient()
      const spgNftContract = requireEnv('SPG_NFT_CONTRACT_ADDRESS') as Address

      // 1) Gather IP metadata
      const ipAnswers = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'IP Title:', default: 'My IP Asset' },
        { type: 'input', name: 'description', message: 'IP Description:', default: 'Test IP Asset' },
        { type: 'input', name: 'watermarkImg', message: 'Watermark Image URL:', default: 'https://picsum.photos/200' },
        { type: 'input', name: 'rarity', message: 'Attribute: Rarity?', default: 'Legendary' },
      ])

      // Format IP metadata properly (per the tutorial)
      const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
        title: ipAnswers.title,
        description: ipAnswers.description,
        watermarkImg: ipAnswers.watermarkImg,
        attributes: [
          {
            key: 'Rarity',
            value: ipAnswers.rarity,
          },
        ],
      })

      // 2) Gather NFT metadata
      const nftAnswers = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'NFT Name:', default: 'Ownership NFT' },
        { type: 'input', name: 'description', message: 'NFT Description:', default: 'An NFT representing IP asset ownership.' },
        { type: 'input', name: 'image', message: 'NFT Image URL:', default: 'https://picsum.photos/200' },
      ])

      const nftMetadata = {
        name: nftAnswers.name,
        description: nftAnswers.description,
        image: nftAnswers.image,
      }

      // 3) Upload each to IPFS
      console.log('\nUploading IP metadata to IPFS...')
      const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
      console.log(`IP metadata IPFS hash: ${ipIpfsHash}`)

      console.log('\nUploading NFT metadata to IPFS...')
      const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
      console.log(`NFT metadata IPFS hash: ${nftIpfsHash}`)

      // 4) Compute content hashes
      const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
      const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

      // 5) Mint + register IP in a single transaction
      console.log('\nMinting and registering IP asset. Please wait...')
      const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract,
        terms: [],  // Add additional PIL terms if you’d like
        ipMetadata: {
          ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
          ipMetadataHash: `0x${ipHash}`,
          nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
          nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
      })

      console.log('\nSuccess! 🎉')
      console.log(`Root IPA created at transaction hash: ${response.txHash}`)
      console.log(`IPA ID: ${response.ipId}`)
      console.log(`View on Explorer: https://explorer.story.foundation/ipa/${response.ipId}`)
    } catch (error) {
      console.error(`Error registering IP: ${(error as Error).message}`)
      process.exit(1)
    }
  })
