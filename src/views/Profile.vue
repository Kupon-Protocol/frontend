<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { useEthers } from 'vue-dapp'
import useKuponFactory from "../hooks/useKuponFactory"
import NftContractCard from "../components/NftContractCard.vue"

const { address: userAddress, chainId, isActivated } = useEthers()
const { contract: factoryContract } = useKuponFactory()

// DATA
const nftContractAddresses = ref([])

// ON CREATE
onMounted(() => {
  fetchNftAddresses()
});

// METHODS
async function fetchNftAddresses() {
  nftContractAddresses.value = []
  
  if (userAddress.value) {
    nftContractAddresses.value = await factoryContract().getNftsByIssuer(userAddress.value)
  }
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
    <h1>Profile</h1>

    <p v-if="isActivated">User address: {{userAddress}}</p>

    <ul class="nav nav-tabs" id="nftTab" role="tablist">

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

    </ul>

    <div class="tab-content" id="nftTabContent">
      <div class="tab-pane fade show active" id="minted" role="tabpanel" aria-labelledby="minted-tab">...</div>

      <div class="tab-pane fade" id="issued" role="tabpanel" aria-labelledby="issued-tab">
        <div class="row mb-5 mt-3">
          <div class="col-4" v-for="nftAddress in nftContractAddresses">
            <NftContractCard :address="nftAddress" />
          </div>
        </div>
      </div>
    </div>

    

    
  </div>
</template>
