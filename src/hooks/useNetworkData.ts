import { computed } from 'vue'
import { useEthers } from 'vue-dapp'

export default function useNetworkData() {
  const { chainId } = useEthers()

  // COMPUTED
  const supportedNetworkName = computed(function() {
    if (chainId.value == 80001) {
      return "Mumbai Testnet"
    }

    return "Unsupported network"
  })

  const isNetworkSupported = computed(function() {
    if (chainId.value == 80001) { // mumbai testnet
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