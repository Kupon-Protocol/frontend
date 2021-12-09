<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from 'vue-router'
import useKuponNft from "../hooks/useKuponNft" 

const router = useRouter()

// PROPS
const props = defineProps({address: String})

// DATA
const { contract } = useKuponNft()
const nftName = ref("")
const nftDescription = ref("")
const nftImage = ref("")
const imageLoaded = ref(false)

// ON CREATE
onMounted(async () => {
  if (props.address) {
    nftName.value = await contract(props.address).name()
    nftDescription.value = await contract(props.address).description()
    nftImage.value = await contract(props.address).image()
  }
});

// METHODS
function goToDetails() {
  router.push({
    name: "NftContractDetails",
    params: {
      nftAddress: props.address,
    },
  })
}
</script>

<template>
<div class="card card-nft">
  <img v-show="imageLoaded" :src="nftImage" @load="imageLoaded=true" @click="goToDetails" class="card-img-top card-nft-img">
  <img v-if="!imageLoaded" src="../assets/img-placeholder.jpg" @click="goToDetails" class="card-img-top card-nft-img">
  
  <div class="card-body">
    <h5 class="card-title card-nft-title" @click="goToDetails">{{nftName}}</h5>
  </div>
</div>
</template>

<style scoped>
.card-img-top, .card-title {
  cursor: pointer;
}
</style>
