<script setup lang="ts">
import { onMounted } from "vue";
import LayoutHeader from './components/LayoutHeader.vue'
import { useEthers, useWallet } from 'vue-dapp'

const { connect } = useWallet()
const { isActivated } = useEthers()

onMounted(() => {
  // if user already connected via MetaMask before, connect them automatically on the next visit
  if (!isActivated.value && localStorage.getItem("connected") == "metamask") {
    connect("metamask")
  }
})
</script>

<template>
  <layout-header />

  <div class="container mt-3">
    <router-view></router-view>
  </div>
  
  <vdapp-board />
</template>
