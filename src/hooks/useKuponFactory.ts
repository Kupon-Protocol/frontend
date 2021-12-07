import { computed } from 'vue'
import { ethers } from 'ethers'
import { useEthers } from 'vue-dapp'
import KuponFactory from '../abi/KuponFactory.json'

export default function useKuponFactory() {
  const { chainId, signer } = useEthers()

  // COMPUTED
  const address = computed(function() {
    if (chainId.value == 80001) { // Mumbai testnet
      return "0x63f8691b048e68E1C3d6E135aDc81291A9bb1987"
    } else if (chainId.value == 3) { // Ropsten testnet
      return "0x2919f0bE09549814ADF72fb0387D1981699fc6D4"
    } else if (chainId.value == 31337) { // localhost
      return "0x7e8aB50697C7Abe63Bdab6B155C2FB8D285458cB"
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