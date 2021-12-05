<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { ethers } from "ethers"
import { displayEther, useEthers } from 'vue-dapp'
import useKuponFactory from "../hooks/useKuponFactory" 
import useNetworkData from "../hooks/useNetworkData" 
import NftCard from "../components/NftCard.vue"

const { address: userAddress, balance, isActivated } = useEthers()
const { contract: factoryContract } = useKuponFactory()
const { isNetworkSupported, supportedNetworkName } = useNetworkData()

// DATA
const nftContractAddresses = ref([])

// ON CREATE
onMounted(async () => {
  if (userAddress.value) {
    nftContractAddresses.value = await factoryContract().getNftsByIssuer(userAddress.value)
  }
});
</script>

<template>
  <div class="text-center">
    <h1>Profile</h1>

    <p v-if="isActivated">User address: {{userAddress}}</p>
    <p v-if="isActivated">Network: {{supportedNetworkName}}</p>
    <p v-if="isActivated && isNetworkSupported">Balance: {{displayEther(balance)}}</p>

    <div class="row mb-5">
      <div class="col-4" v-for="nftAddress in nftContractAddresses">
        <NftCard :address="nftAddress" />
      </div>
    </div>

    
  </div>
</template>
