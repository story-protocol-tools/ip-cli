import { PinataSDK } from 'pinata-web3'
import { requireEnv } from './config'

let pinata: PinataSDK | null = null

function getPinata(): PinataSDK {
  if (!pinata) {
    const pinataJwt = requireEnv('PINATA_JWT')
    pinata = new PinataSDK({ pinataJwt })
  }
  return pinata
}

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  const pinataClient = getPinata()
  const { IpfsHash } = await pinataClient.upload.json(jsonMetadata)
  return IpfsHash
}
