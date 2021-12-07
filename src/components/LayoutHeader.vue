<script setup lang="ts">
import { inject, watch } from "vue"
import { useBoard, useEthers, useWallet, shortenAddress } from 'vue-dapp'
import { useRouter } from 'vue-router'
import useNetworkData from "../hooks/useNetworkData" 

const store = inject("store")

const { open } = useBoard()
const { address, chainId, isActivated } = useEthers()
const { connect, disconnect, walletName } = useWallet()
const router = useRouter()
const { isNetworkSupported, supportedNetworkName } = useNetworkData()

// METHODS
function goToCreateNft() {
  router.push({name: 'CreateNft'})
}

function logout() {
  localStorage.setItem("connected", null);
  disconnect()
}

function changeNetwork(networkName: string) {
  let method;
  let params;

  if (networkName == "ropsten") {
    method = "wallet_switchEthereumChain"
    params = [{ chainId: "0x3" }] 
  } else if (networkName == "mumbai") {
    method = "wallet_addEthereumChain"
    params = [{ 
      blockExplorerUrls: [ "https://mumbai.polygonscan.com" ],
      chainId: "0x13881",
      chainName: "Mumbai Testnet",
      nativeCurrency: { decimals: 18, name: "Matic", symbol: "MATIC" }, 
      rpcUrls: ["https://matic-mumbai.chainstacklabs.com"]
    }] 
  }

  window.ethereum.request({ 
    method: method, 
    params: params
  });
}

// WATCHERS
watch(supportedNetworkName, () => {
  // store to local storage in order to enable automated connection on the next visit
  if (!isActivated.value && localStorage.getItem("connected") == "metamask") {
    connect("metamask")
  }
})

watch(isActivated, (val: any) => {
  // store to local storage in order to enable automated connection on the next visit
  if (val && walletName.value == "metamask") {
    localStorage.setItem("connected", "metamask");
  }
})

watch(address, function () {
  store.factory.methods.fetchNftContractAddresses()
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <img src="../assets/kupon-logo-transparent.png" width="84" height="84">
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

          <div class="btn-group mx-1">
            <button v-if="isActivated && !isNetworkSupported" type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{{ supportedNetworkName }}</button>
            <button v-if="isActivated && isNetworkSupported" type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{{ supportedNetworkName }}</button>
            
            <ul class="dropdown-menu">
              <li><span @click="changeNetwork('mumbai')" class="dropdown-item">Mumbai testnet</span></li>
              <li><span @click="changeNetwork('ropsten')" class="dropdown-item">Ropsten testnet</span></li>
            </ul>
          </div>

          <button v-if="isActivated" class="btn btn-secondary mx-1" @click="logout">{{ shortenAddress(address) }}</button>

          <button v-if="isActivated" @click="goToCreateNft" class="btn btn-primary mx-1">Create NFT</button> 

          <button v-else @click="open" class="btn btn-primary mx-1">Connect Wallet</button>

        </div>

      </div>
    </div>
  </nav>
  
</template>
