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
  },

  // getClaimsByNftAddress(contractAddress: any) {},
  // getCompletionsByNftAddress(contractAddress: any) {}

}

// METHODS
const methods = {

  async fetchAllNfts(contractAddress: any) {
    if (isActivated.value) {
      const result = await nftContract(contractAddress).fetchAllNfts()

      for (let nftItem of result) {
        console.log(nftItem.status)

        switch(nftItem.status) { 
          case 0: { 
            console.log("Minted")
            break; 
          } 
          case 1: { 
            console.log("Claimed")
            break; 
          } 
          case 2: { 
            console.log("Completed")
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
