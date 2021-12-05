<script setup lang="ts">
import { displayEther, useEthers } from 'vue-dapp'
import useKuponFactory from "../hooks/useKuponFactory" 
import useNetworkData from "../hooks/useNetworkData" 

const { address: userAddress, balance, chainId, isActivated } = useEthers()
const { address: factoryAddress } = useKuponFactory()
const { isNetworkSupported, supportedNetworkName } = useNetworkData()


</script>

<template>
  <div class="text-center">
    <h1>Profile</h1>

    <p v-if="isActivated">User address: {{userAddress}}</p>
    <p v-if="isActivated">Network: {{supportedNetworkName}}</p>
    <p v-if="isActivated && isNetworkSupported">Balance: {{displayEther(balance)}}</p>
    <p v-if="isActivated">Factory address: {{factoryAddress}}</p>
  </div>
</template>
