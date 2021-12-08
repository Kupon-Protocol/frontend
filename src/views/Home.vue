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
          Create coupons and<br>
          vouchers as NFTs
        </h5>
      </div>
    </div>

    <h3>Hot Coupons & Vouchers 🔥</h3>

    <div class="row mb-5 mt-3">
      <div class="col-sm-3" v-for="nftAddress in store.state.nftContractAddresses">
        <NftContractCard :address="nftAddress" />
      </div>
    </div>
  </div>
</template>
