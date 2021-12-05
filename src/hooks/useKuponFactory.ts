import { computed } from 'vue'
import { useEthers } from 'vue-dapp'

export default function useKuponFactory() {
  const { chainId } = useEthers()

  // COMPUTED
  const address = computed(function() {
    if (chainId.value == 80001) { // Mumbai testnet
      return "0xeA2f99fE93E5D07F61334C5Eb9c54c5D5C957a6a"
    }

    return "0xNone"
  })

  // RETURN
  return {
    address
  }
}