import { computed } from 'vue'
import { ethers } from 'ethers'
import { useEthers } from 'vue-dapp'
import KuponFactory from '../abi/KuponFactory.json'

export default function useKuponFactory() {
  const { chainId, signer } = useEthers()

  // COMPUTED
  const address = computed(function() {
    if (chainId.value == 80001) { // Mumbai testnet
      return "0xeA2f99fE93E5D07F61334C5Eb9c54c5D5C957a6a"
    } else if (chainId.value == 31337) { // localhost
      return "0xC6c17896fa051083324f2aD0Ed4555dC46D96E7f"
    }

    return "0xNone"
  })

  // METHODS
  function contract() {
    const intfc = new ethers.utils.Interface(KuponFactory.abi)
    return new ethers.Contract(address.value, intfc, signer.value)
  }

  // RETURN
  return {
    address,
    contract
  }
}