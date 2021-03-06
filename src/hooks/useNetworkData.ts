import { computed } from 'vue'
import { useEthers } from 'vue-dapp'

export default function useNetworkData() {
  const { chainId } = useEthers()

  // COMPUTED
  const supportedNetworkName = computed(function() {
    if (chainId.value == 80001) {
      return "Mumbai"
    } else if (chainId.value == 3) {
      return "Ropsten"
    } else if (chainId.value == 31337) {
      return "Localhost"
    }

    return "Unsupported network"
  })

  const currency = computed(function() {
    if (chainId.value == 80001 || chainId.value == 137) {
      return "MATIC"
    }

    return "ETH"
  })

  const isNetworkSupported = computed(function() {
    if (chainId.value == 80001) { // mumbai testnet
      return true
    } else if (chainId.value == 3) { // Ropsten testnet
      return true
    } else if (chainId.value == 31337) { // localhost
      return true
    }

    return false
  })

  // RETURN
  return {
    currency,
    isNetworkSupported,
    supportedNetworkName
  }
}