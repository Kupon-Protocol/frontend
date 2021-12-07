import { reactive, readonly } from "vue";
import { useEthers } from 'vue-dapp'
import useKuponNft from "../hooks/useKuponNft"

const { isActivated } = useEthers()
const { contract: nftContract } = useKuponNft()

const state = reactive({
  allNfts: {}
})

// GETTERS
const getters = {

  getNftsByAddress(contractAddress: any) {
    return state.allNfts[contractAddress]
  }

  // TODO: getClaimsByNftAddress
  // TODO: getCompletionsByNftAddress

}

// METHODS
const methods = {

  async fetchAllNfts(contractAddress: any) {
    if (isActivated.value) {
      state.allNfts[contractAddress] = await nftContract(contractAddress).fetchAllNfts()
    }
  }

}

export default {
  state: readonly(state),
  getters,
  methods
}
