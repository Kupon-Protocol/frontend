<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { useEthers } from 'vue-dapp'
import useKuponFactory from "../hooks/useKuponFactory" 
import NftContractCard from "../components/NftContractCard.vue"

const { chainId, isActivated } = useEthers()
const { contract: factoryContract } = useKuponFactory()

// DATA
const nftContractAddresses = ref()

// ON CREATE
onMounted(() => {
  fetchNftAddresses()
});

// METHODS
async function fetchNftAddresses() {
  if (isActivated.value) {
    const addrLength = await factoryContract().getNftAddressesLength()

    nftContractAddresses.value = []
    let tempArray = []

    for (let i = 0; i < addrLength; i++) {
      let tempAddress = await factoryContract().getNftAddressByIndex(i)
      tempArray.push(tempAddress)
    }

    nftContractAddresses.value = tempArray
  }
}

// WATCHERS
watch(chainId, function () {
  fetchNftAddresses()
})
</script>

<template>
  <div class="text-center">
    <h1>Kupon Protocol</h1>

    <div class="row mb-5">
      <div class="col-4" v-for="nftAddress in nftContractAddresses">
        <NftContractCard :address="nftAddress" />
      </div>
    </div>
  </div>
</template>
