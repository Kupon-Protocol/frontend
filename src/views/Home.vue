<script setup lang="ts">
import { inject } from "vue"
import NftContractCard from "../components/NftContractCard.vue"

const store = inject("store")
</script>

<template>
  <div>

    <div class="card bg-dark text-white card-hero">
      <img src="../assets/hero.png" class="card-img hero-card-img" alt="Hero image">
      <div class="card-img-overlay hero-card-img-overlay">
        <h5 class="card-title hero-card-title">
          World's leading NFT<br>
          coupon platform
        </h5>
      </div>
    </div>

    <h3>Hot Collections 🔥</h3>

    <div class="row mb-5 mt-5">
      <div class="col-3" v-for="nftAddress in store.factory.state.nftContractAddresses">
        <NftContractCard :address="nftAddress" />
      </div>
    </div>
  </div>
</template>
