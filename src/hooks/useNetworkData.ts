import { computed } from 'vue'
import { useEthers } from 'vue-dapp'

export default function useNetworkData() {
  const { chainId } = useEthers()

  // COMPUTED
  const supportedNetworkName = computed(function() {
    if (chainId.value == 1) {
      return "Ethereum"
    } else if (chainId.value == 137) {
      return "Polygon"
    }

    return "Unsupported network"
  })

  const isNetworkSupported = computed(function() {
    if (chainId.value == 1) {
      return true
    } else if (chainId.value == 137) {
      return true
    }

    return false
  })

  // RETURN
  return {
    isNetworkSupported,
    supportedNetworkName
  }
}