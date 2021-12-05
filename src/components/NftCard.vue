<script setup lang="ts">
import { onMounted, ref } from "vue"
import useKuponNft from "../hooks/useKuponNft" 

// PROPS
const props = defineProps({address: String})

// DATA
const { contract } = useKuponNft()
const nftName = ref("")
const nftDescription = ref("")
const nftImage = ref("")

// ON CREATE
onMounted(async () => {
  if (props.address) {
    nftName.value = await contract(props.address).name()
    nftDescription.value = await contract(props.address).description()
    nftImage.value = await contract(props.address).image()
  }
});

</script>

<template>
<div class="card">
  <img :src="nftImage" class="card-img-top">
  <div class="card-body">
    <h5 class="card-title">{{nftName}}</h5>
    <p class="card-text">{{nftDescription}}</p>
  </div>
</div>
</template>
