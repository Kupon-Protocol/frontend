<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue"
import { useEthers } from 'vue-dapp'
import { ethers } from "ethers"
import useKuponNft from "../hooks/useKuponNft" 

const store = inject("store")

const { address: userAddress, balance, chainId } = useEthers()
const { contract } = useKuponNft()

// PROPS
const props = defineProps({nftAddress: String})

// DATA
const nftName = ref("")
const nftDescription = ref("")
const nftImage = ref("")
const nftSupply = ref(0)
const nftMinted = ref(0)
const nftPriceWei = ref(0)
const nftClaimed = ref(0)
const nftCompleted = ref(0)
const userNftBalance = ref(0)
const sending = ref(false)

// ON CREATE
onMounted(async () => {
  if (props.nftAddress) {
    nftName.value = await contract(props.nftAddress).name()
    nftDescription.value = await contract(props.nftAddress).description()
    nftImage.value = await contract(props.nftAddress).image()
    nftSupply.value = await contract(props.nftAddress).maxSupply()
    fetchTotalMinted()
    nftPriceWei.value = await contract(props.nftAddress).price()
    //nftClaimed.value = await contract(props.nftAddress).claimedCounter()
    //nftCompleted.value = await contract(props.nftAddress).completedCounter()

    fetchUserNftBalance()

    store.nft.methods.fetchAllNfts(props.nftAddress)
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

// METHODS
async function fetchTotalMinted() {
  nftMinted.value = await contract(props.nftAddress).totalMinted()
}

async function fetchUserNftBalance() {
  userNftBalance.value = await contract(props.nftAddress).balanceOf(userAddress.value)
}

function mintNft() {
  sending.value = true

  try {
    contract(props.nftAddress).mint(userAddress.value, {
      value: String(nftPriceWei.value)
    }).then((tx: any) => {
      return tx.wait().then((receipt: any) => {
        console.log("receipt status: " + receipt.status)
        console.log(receipt)

        if (receipt.status == 1) {
          console.log("Success")
          fetchTotalMinted()
          fetchUserNftBalance()
        } else {
          console.log("Failed")
        }

        sending.value = false

        return true;
      }, (error: any) => {
        return error.checkCall().then((error: any) => {
          console.log("Error message:", error)
          sending.value = false
          return false
        });
      }
    )});
  
  } catch(e) {
    sending.value = false
    console.log(e)
  }
}
</script>

<template>
  <div class="row">
    <div class="col-md-8 offset-md-2 text-center d-flex flex-column align-items-center">
    
      <div class="card" style="width: 18rem;">
        <img class="img-fluid rounded" :src="nftImage" />
      </div>
      
      <h2 class="mt-2">{{nftName}}</h2>

      <p class="mt-2">{{nftDescription}}</p>

      <button 
        class="btn btn-primary mb-4"
        v-if="userNftBalance > 0">
        Claim this offer
      </button>

      <div class="row">
        <div class="col nft-info-box rounded">
          <h5>Stats</h5>
          <p>Max supply: {{nftSupply}}</p>
          <p>Already minted: {{nftMinted}}</p>
        </div>

        <div class="col nft-info-box rounded mx-2">
          <h5>Additional info</h5>
          <p>Claims: {{nftClaimed}}</p>
          <p>Completed claims: {{nftCompleted}}</p>
        </div>
      </div>

      <h5 class="mt-4">Price: {{nftPrice}}</h5>

      <button v-if="Number(nftMinted) < Number(nftSupply)" @click="mintNft" class="btn btn-success mt-4" :disabled="sending">
        <span v-if="sending" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        Mint NFT
      </button>

      <button v-if="Number(nftMinted) >= Number(nftSupply)" class="btn btn-secondary" disabled>SOLD OUT!</button>
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
