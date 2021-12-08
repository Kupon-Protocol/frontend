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
const nftIssuer = ref()
const userNftBalance = ref(0)
const minting = ref(false)
const claiming = ref(false)
const completing = ref()

// ON CREATE
onMounted(async () => {
  if (props.nftAddress) {
    nftName.value = await contract(props.nftAddress).name()
    nftDescription.value = await contract(props.nftAddress).description()
    nftImage.value = await contract(props.nftAddress).image()
    nftSupply.value = await contract(props.nftAddress).maxSupply()
    fetchTotalMinted()
    nftPriceWei.value = await contract(props.nftAddress).price()
    nftIssuer.value = await contract(props.nftAddress).owner()

    fetchUserNftBalance()

    store.methods.fetchAllNfts(props.nftAddress)
  }
});

// COMPUTED
const isIssuer = computed(function() {
  // is current user this NFT issuer?
  if (nftIssuer.value == userAddress.value) {
    return true
  }

  return false
})

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
          store.methods.fetchAllNfts(props.nftAddress, true) // hard reload in order to get the user's Claims array updated
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

function markCompleted(tokenId: number) {
  completing.value = tokenId

  try {
    contract(props.nftAddress).markCompleted(tokenId).then((tx: any) => {
      return tx.wait().then((receipt: any) => {
        console.log("receipt status: " + receipt.status)
        console.log(receipt)

        if (receipt.status == 1) {
          console.log("Success")
          store.methods.fetchAllNfts(props.nftAddress, true) // hard reload in order to get the user's Claims array updated
        } else {
          console.log("Failed")
        }

        completing.value = null

        return true;
      }, (error: any) => {
        return error.checkCall().then((error: any) => {
          console.log("Error message:", error)
          completing.value = null
          return false
        });
      }
    )});
  
  } catch(e) {
    completing.value = null
    console.log(e)
  }
}

function mintNft() {
  minting.value = true

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

        minting.value = false

        return true;
      }, (error: any) => {
        return error.checkCall().then((error: any) => {
          console.log("Error message:", error)
          minting.value = false
          return false
        });
      }
    )});
  
  } catch(e) {
    minting.value = false
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

      <button v-if="Number(nftMinted) < Number(nftSupply)" @click="mintNft" class="btn btn-primary mt-2" :disabled="minting">
        <span v-if="minting" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        Mint for {{nftPrice}}
      </button>

      <button v-if="Number(nftMinted) >= Number(nftSupply)" class="btn btn-secondary mt-2" disabled>SOLD OUT!</button>

      <div v-if="userNftBalance > 0">
        <hr>

        <p class="mb-3 mt-2">Your NFT balance: {{userNftBalance}}</p>

        <button 
        :disabled="claiming"
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
          your account address is so they can verify your claim.
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

  <div class="row mt-4" v-if="isIssuer && store.state.claimsArray.length > 0">
    <hr>
    <h3 class="text-center">Admin</h3>

    <p>
      These NFT holders have requested the offer that the NFT promises. These NFTs are now burned 
      and cannot be re-sold or transfered. After you provide an offer to one of these users, mark 
      the claim as completed.
    </p>

    <table class="table text-white">
      <thead>
        <tr>
          <th scope="col">Token ID</th>
          <th scope="col">User address</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="claimData of store.state.claimsArray">
          <th scope="row">{{claimData[0]}}</th>
          <td>{{claimData[1]}}</td>
          <td>
            <button 
              @click="markCompleted(claimData[0])"
              class="btn btn-primary btn-sm"
              :disabled="completing==claimData[0]"
            >
              <span v-if="completing==claimData[0]" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
              Mark completed
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
