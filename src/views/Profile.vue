<script setup lang="ts">
import { watch } from 'vue'
import { displayEther, useEthers } from 'vue-dapp'
import useKuponFactory from "../hooks/useKuponFactory" 
import useNetworkData from "../hooks/useNetworkData" 

const { address: userAddress, balance, chainId, isActivated } = useEthers()
const { address: factoryAddress } = useKuponFactory()
const { isNetworkSupported, supportedNetworkName } = useNetworkData()

console.log(chainId.value)

watch(chainId, function (val: any) {
  if (val) {
    console.log("Chain: " + val);
  }
});
</script>

<template>
  <div class="text-center">Profile</div>

  <p v-if="isActivated">User address: {{userAddress}}</p>
  <p v-if="isActivated">Network: {{supportedNetworkName}}</p>
  <p v-if="isActivated && isNetworkSupported">Balance: {{displayEther(balance)}}</p>
  <p v-if="isActivated">Factory address: {{factoryAddress}}</p>
</template>
