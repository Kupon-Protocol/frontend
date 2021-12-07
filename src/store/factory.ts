import { reactive, readonly } from "vue";
import { useEthers } from 'vue-dapp'
import useKuponFactory from "../hooks/useKuponFactory" 

const { isActivated } = useEthers()
const { contract: factoryContract } = useKuponFactory()

const state = reactive({
  nftContractAddresses: []
})

// METHODS
const methods = {

  async fetchNftContractAddresses() {
    if (isActivated.value) {
      state.nftContractAddresses = await factoryContract().getNftAddressesArray()
    }
  }
  
}

export default {
  state: readonly(state),
  methods
}
