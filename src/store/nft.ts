import { reactive, readonly } from "vue";
import { useEthers } from 'vue-dapp'
import useKuponNft from "../hooks/useKuponNft"

const { isActivated } = useEthers()
const { contract: nftContract } = useKuponNft()

const state = reactive({
  allNfts: {},
  claimed: 0,
  completed: 0
})

// GETTERS
const getters = {

  getNftsByAddress(contractAddress: any) {
    return state.allNfts[contractAddress]
  }

}

// METHODS
const methods = {

  increaseClaims() {
    state.claimed++
  },

  async fetchAllNfts(contractAddress: any) {
    if (isActivated.value) {
      const result = await nftContract(contractAddress).fetchAllNfts()

      // reset values
      state.claimed = 0
      state.completed = 0

      for (let nftItem of result) {
        switch(nftItem.status) { 
          case 0: { // Minted
            break; 
          } 
          case 1: { // Claimed
            state.claimed++
            break; 
          } 
          case 2: { // Completed
            state.completed++
            break; 
          } 
        } 
      }
      state.allNfts[contractAddress] = JSON.parse(JSON.stringify(result))
    }
  }

}

export default {
  state: readonly(state),
  getters,
  methods
}
