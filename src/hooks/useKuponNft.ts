import { ethers } from 'ethers'
import { useEthers } from 'vue-dapp'
import KuponNft from '../abi/KuponNft.json'

export default function useKuponNft() {
  const { signer } = useEthers()

  // METHODS
  function contract(address: string) {
    const intfc = new ethers.utils.Interface(KuponNft.abi)
    return new ethers.Contract(address, intfc, signer.value)
  }

  // RETURN
  return {
    contract
  }
}