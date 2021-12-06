<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useEthers } from 'vue-dapp'
import { ethers } from "ethers"
import useKuponNft from "../hooks/useKuponNft" 

const { address: userAddress, balance, chainId } = useEthers()

// PROPS
const props = defineProps({nftAddress: String})

// DATA
const { contract } = useKuponNft()
const nftName = ref("")
const nftDescription = ref("")
const nftImage = ref("")
const nftSupply = ref(0)
const nftMinted = ref(0)
const nftPriceWei = ref(0)

// ON CREATE
onMounted(async () => {
  if (props.nftAddress) {
    nftName.value = await contract(props.nftAddress).name()
    nftDescription.value = await contract(props.nftAddress).description()
    nftImage.value = await contract(props.nftAddress).image()
    nftSupply.value = await contract(props.nftAddress).maxSupply()
    nftMinted.value = await contract(props.nftAddress).totalMinted()
    nftPriceWei.value = await contract(props.nftAddress).price()
  }
});

// COMPUTED
const nftPrice: any = computed(function() {
  let currency: string = "ETH"

  if (chainId.value == 137 || chainId.value == 80001) {
    currency = "MATIC"
  }

  if (nftPriceWei.value == 0) {
    return "FREE!"
  }

  return String(ethers.utils.formatEther(String(nftPriceWei.value))) + " " + currency
})
</script>

<template>
  <div class="row">
    <div class="col-md-8 offset-md-2 text-center d-flex flex-column align-items-center">
    
      <div class="card" style="width: 18rem;">
        <img class="img-fluid rounded" :src="nftImage" />
      </div>
      
      <h2 class="mt-2">{{nftName}}</h2>

      <p class="mt-2">{{nftDescription}}</p>

      <div class="row">
        <div class="col nft-info-box rounded">
          <h5>Stats</h5>
          <p>Max supply: {{nftSupply}}</p>
          <p>Already minted: {{nftMinted}}</p>
        </div>

        <div class="col nft-info-box rounded mx-2">
          <h5>Additional info</h5>
          <p>Claims:</p>
          <p>Completed claims:</p>
        </div>
      </div>

      <h5 class="mt-4">Price: {{nftPrice}}</h5>

      <button class="btn btn-success mt-4" disabled>Mint NFT</button>
    </div>
  </div>
</template>

<style scoped>
.nft-info-box {
  border: 1px solid black;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 20px;
}
</style>
