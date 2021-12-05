<script setup lang="ts">
import { watch } from "vue"
import { useBoard, useEthers, useWallet, shortenAddress } from 'vue-dapp'
import { useRouter } from 'vue-router'

const { open } = useBoard()
const { address, isActivated } = useEthers()
const { walletName } = useWallet()
const router = useRouter()

// METHODS
function goToCreateNft() {
  router.push({name: 'CreateNft'})
}

// WATCHERS
watch(isActivated, (val: any) => {
  // store to local storage in order to enable automated connection on the next visit
  if (val && walletName.value == "metamask") {
    localStorage.setItem("connected", "metamask");
  }
})

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        Kupon Protocol
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/profile">Profile</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/about">About</router-link>
          </li>
          
        </ul>

        <div class="d-flex">

          <button v-if="isActivated" class="btn btn-outline-success">{{ shortenAddress(address) }}</button>
          <button v-if="isActivated" @click="goToCreateNft" class="btn btn-outline-success">Create NFT</button>
          <button v-else @click="open" class="btn btn-outline-success">Connect Wallet</button>

        </div>

      </div>
    </div>
  </nav>
  
</template>
