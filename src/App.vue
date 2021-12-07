<script setup lang="ts">
import { onMounted, provide, watch } from "vue"
import LayoutHeader from './components/LayoutHeader.vue'
import Footer from './components/Footer.vue'
import { useEthers, useWallet } from 'vue-dapp'
import store from "./store"
import useNetworkData from "./hooks/useNetworkData" 

const { connect } = useWallet()
const { isActivated } = useEthers()
const { supportedNetworkName } = useNetworkData()

provide("store", store)

onMounted(() => {
  // if user already connected via MetaMask before, connect them automatically on the next visit
  if (!isActivated.value && localStorage.getItem("connected") == "metamask") {
    connect("metamask")
  }
})

// WATCHERS
watch(supportedNetworkName, () => {
  store.factory.methods.fetchNftContractAddresses()
})

watch(isActivated, function () {
  store.factory.methods.fetchNftContractAddresses()
})
</script>

<template>
  <layout-header />

  <div class="container mt-3">
    <router-view></router-view>
  </div>

  <Footer />
  
  <vdapp-board />
</template>
