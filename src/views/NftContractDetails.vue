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
const userNftBalance = ref(0)
const sending = ref(false)
const claiming = ref(false)

// ON CREATE
onMounted(async () => {
  if (props.nftAddress) {
    nftName.value = await contract(props.nftAddress).name()
    nftDescription.value = await contract(props.nftAddress).description()
    nftImage.value = await contract(props.nftAddress).image()
    nftSupply.value = await contract(props.nftAddress).maxSupply()
    fetchTotalMinted()
    nftPriceWei.value = await contract(props.nftAddress).price()

    fetchUserNftBalance()

    store.methods.fetchAllNfts(props.nftAddress)
  }
});

// COMPUTED
const nftPrice = computed(function() {
  let currency: string = "ETH"

  if (chainId.value == 137 || chainId.value == 80001) {
    currency = "MATIC"
  }

  if (nftPriceWei.value == 0) {
    return "FREE!"
  }

  return String(ethers.utils.formatEther(String(nftPriceWei.value))) + " " + currency
})

const userOpenClaim = computed(function() {
  if (store.state.userClaimedNftAddresses.includes(props.nftAddress)) {
    return true
  }

  return false
})

// METHODS
async function claimNftOffer() {
  // NFT holder can claim the underlying offer by the NFT issuer
  claiming.value = true

  // get NFT IDs that current user has
  const userNftIds = await contract(props.nftAddress).fetchNftsByHolder(userAddress.value)

  try {
    contract(props.nftAddress).claim(Number(userNftIds[0])).then((tx: any) => {
      return tx.wait().then((receipt: any) => {
        console.log("receipt status: " + receipt.status)
        console.log(receipt)

        if (receipt.status == 1) {
          console.log("Success")
          fetchUserNftBalance()
          store.methods.increaseClaims()
        } else {
          console.log("Failed")
        }

        claiming.value = false

        return true;
      }, (error: any) => {
        return error.checkCall().then((error: any) => {
          console.log("Error message:", error)
          claiming.value = false
          return false
        });
      }
    )});
  
  } catch(e) {
    claiming.value = false
    console.log(e)
  }
}

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

    <div class="col-md-5">
      <div class="card">
        <img class="img-fluid rounded" :src="nftImage" />
      </div>
    </div>

    <div class="col-md-7">
      <h3 class="mt-2">{{nftName}}</h3>
      <p class="mt-2">{{nftDescription}}</p>

      <button v-if="Number(nftMinted) < Number(nftSupply)" @click="mintNft" class="btn btn-primary mt-2" :disabled="sending">
        <span v-if="sending" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        Mint for {{nftPrice}}
      </button>

      <button v-if="Number(nftMinted) >= Number(nftSupply)" class="btn btn-secondary mt-2" disabled>SOLD OUT!</button>

      <div v-if="userNftBalance > 0">
        <hr>

        <p class="mb-3 mt-2">Your NFT balance: {{userNftBalance}}</p>

        <button 
        @click="claimNftOffer"
        class="btn btn-secondary"
        v-if="userNftBalance > 0">
          <span v-if="claiming" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          Claim this offer
        </button>
      
      </div>

      <div v-if="userOpenClaim">
        <hr>

        <h3>Open claim!</h3>

        <p>
          You have at least one open claim on this NFT's offer. Please contact the NFT issuer and tell them what 
          your address is.
        </p>
      </div>
      
    </div>
  </div>

  <div class="row mt-4">
    <div class="col nft-info-box rounded">
      <h5>Stats</h5>
      <p>Max supply: {{nftSupply}}</p>
      <p>Already minted: {{nftMinted}}</p>
    </div>

    <div class="col nft-info-box rounded mx-2">
      <h5>Additional info</h5>
      <p>Claims: {{store.state.claimed}}</p>
      <p>Completed claims: {{store.state.completed}}</p>
    </div>
  </div>
</template>

<style scoped>
.nft-info-box {
  border: 1px solid #ffffff;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 20px;
}
</style>
