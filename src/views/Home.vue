<script setup lang="ts">
import { inject } from "vue"
import NftContractCard from "../components/NftContractCard.vue"

const store = inject("store")
</script>

<template>
  <div class="text-center">
    <h1>Kupon Protocol</h1>

    <div class="row mb-5">
      <div class="col-4" v-for="nftAddress in store.factory.state.nftContractAddresses">
        <NftContractCard :address="nftAddress" />
      </div>
    </div>
  </div>
</template>
