import { computed } from 'vue'
import { useEthers } from 'vue-dapp'

export default function useKuponFactory() {
  const { chainId } = useEthers()

  // COMPUTED
  const address = computed(function() {
    if (chainId.value == 1) {
      return "0x123"
    }

    return "0x456"
  })

  // RETURN
  return {
    address
  }
}