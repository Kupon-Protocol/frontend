<script setup lang="ts">
import { inject, onMounted, ref, watch } from "vue"
import { useEthers } from 'vue-dapp'
import useKuponFactory from "../hooks/useKuponFactory"
import useKuponNft from "../hooks/useKuponNft" 
import NftContractCard from "../components/NftContractCard.vue"

const { address: userAddress, chainId, isActivated } = useEthers()
const { contract: factoryContract } = useKuponFactory()
const { contract: nftContract } = useKuponNft()

const store = inject("store")

// DATA
const issuedAddresses = ref([])
const mintedAddresses = ref([])

// ON CREATE
onMounted(() => {
  fetchNftAddresses()
});

// METHODS
async function fetchNftAddresses() {
  issuedAddresses.value = []
  
  if (userAddress.value) {
    issuedAddresses.value = await factoryContract().getNftsByIssuer(userAddress.value)
  }

  const allNftAddresses = await factoryContract().getNftAddressesArray()

  let tempMintedAddresses = []
  for (let nftAddress of allNftAddresses) {
    // TODO: fetch an array of NFT IDs instead
    const balance = await nftContract(nftAddress).balanceOf(userAddress.value)

    if (Number(balance) > 0) {
      tempMintedAddresses.push(nftAddress)
    }
  }
  mintedAddresses.value = tempMintedAddresses
}

// WATCHERS
watch(userAddress, function () {
  fetchNftAddresses()
})

watch(chainId, function () {
  fetchNftAddresses()
})
</script>

<template>
  <div class="text-center">
    <h3 class="text-center">Profile</h3>

    <ul class="nav nav-tabs mt-5" id="nftTab" role="tablist">

      <li class="nav-item" role="presentation">
        <button 
          class="nav-link active" 
          id="minted-tab" 
          data-bs-toggle="tab" 
          data-bs-target="#minted" 
          type="button" 
          role="tab" 
          aria-controls="minted" 
          aria-selected="true">My minted NFTs</button>
      </li>

      <li class="nav-item" role="presentation">
        <button 
          class="nav-link" 
          id="issued-tab" 
          data-bs-toggle="tab" 
          data-bs-target="#issued" 
          type="button" 
          role="tab" 
          aria-controls="issued" 
          aria-selected="false">My issued NFTs</button>
      </li>

      <li class="nav-item" role="presentation">
        <button 
          class="nav-link" 
          id="claimed-tab" 
          data-bs-toggle="tab" 
          data-bs-target="#claimed" 
          type="button" 
          role="tab" 
          aria-controls="claimed" 
          aria-selected="false">Offer claims</button>
      </li>

      <li class="nav-item" role="presentation">
        <button 
          class="nav-link" 
          id="completed-tab" 
          data-bs-toggle="tab" 
          data-bs-target="#completed" 
          type="button" 
          role="tab" 
          aria-controls="completed" 
          aria-selected="false">Completed claims</button>
      </li>

    </ul>

    <div class="tab-content" id="nftTabContent">

      <div class="tab-pane fade show active" id="minted" role="tabpanel" aria-labelledby="minted-tab">
        <div class="row mb-5 mt-3">
          <div class="col-sm-4" v-for="nftAddress in mintedAddresses">
            <NftContractCard :address="nftAddress" />
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="issued" role="tabpanel" aria-labelledby="issued-tab">
        <div class="row mb-5 mt-3">
          <div class="col-sm-4" v-for="nftAddress in issuedAddresses">
            <NftContractCard :address="nftAddress" />
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="claimed" role="tabpanel" aria-labelledby="claimed-tab">
        <div class="row mb-5 mt-3">
          <div class="col-sm-4" v-for="nftAddress in store.state.userClaimedNftAddresses">
            <NftContractCard :address="nftAddress" />
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="completed" role="tabpanel" aria-labelledby="completed-tab">
        <div class="row mb-5 mt-3">
          <div class="col-sm-4" v-for="nftAddress in store.state.userCompletedNftAddresses">
            <NftContractCard :address="nftAddress" />
          </div>
        </div>
      </div>

    </div>
    
  </div>
</template>
