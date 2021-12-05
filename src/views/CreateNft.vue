<script setup lang="ts">
import { computed, ref } from "vue"
import { ethers } from "ethers"
import useKuponFactory from "../hooks/useKuponFactory" 
import useNetworkData from "../hooks/useNetworkData" 

const { contract: factoryContract } = useKuponFactory()
const { isNetworkSupported } = useNetworkData()

// DATA
const nftName = ref("")
const nftDescription = ref("")
const nftImage = ref("")
const nftMaxSupply = ref(10)
const nftPrice = ref(0)

// COMPUTED
const isFormValid = computed(function() {
  if (!isNetworkSupported.value) {
    return { status: false, message: "You are on an unsupported network."}
  } else if (nftName.value == "") {
    return { status: false, message: "Title should not be empty."}
  } else if (nftDescription.value == "") {
    return { status: false, message: "Description should not be empty."}
  } else if (nftImage.value == "") {
    return { status: false, message: "Image should not be empty."}
  } else if (nftMaxSupply.value < 1) {
    return { status: false, message: "Max supply cannot be less than 1."}
  } else if (isNaN(nftMaxSupply.value)) {
    return { status: false, message: "Max supply must be a number."}
  } else if (nftPrice.value < 0) {
    return { status: false, message: "Price cannot be below 0."}
  } else if (isNaN(nftPrice.value)) {
    return { status: false, message: "Price must be a number."}
  }

  return { status: true, message: "Form is valid"}
})

// METHODS
function issueNft() {
  console.log("issue nft")

  try {
    factoryContract().createKuponNft(
      nftName.value, 
      'SYMBOL',
      nftDescription.value,
      nftImage.value,
      ethers.BigNumber.from(nftMaxSupply.value), 
      ethers.utils.parseEther(String(nftPrice.value))
    ).then((tx: any) => {
      return tx.wait().then((receipt: any) => {
        console.log("receipt status: " + receipt.status)
        console.log(receipt)

        if (receipt.status == 1) {
          console.log("Success")
        } else {
          console.log("Failed")
        }

        return true;
      }, (error: any) => {
        return error.checkCall().then((error: any) => {
          console.log("Error message:", error)
          return false
        });
      }
    )});
  
  } catch(e) {
    console.log(e)
  }
}

</script>

<template>
  <div class="text-center">
    <h1>Create a Coupon or Voucher as NFT</h1>

    <div class="col-md-6 offset-md-3 mt-5">
      <div class="mb-3">
        <label for="nftTitleInput" class="form-label">NFT title</label>
        <input v-model="nftName" type="text" placeholder="20% discount on product XYZ" class="form-control" id="nftTitleInput" aria-describedby="titleHelp">
        <div id="titleHelp" class="form-text">Short title for your offer.</div>
      </div>

      <div class="mb-3">
        <label for="nftDescription" class="form-label">Description</label>
        <textarea 
          type="text" 
          v-model="nftDescription"
          placeholder="We offer you a 20% discount on XYZ which you can buy on our website example.org" 
          class="form-control" id="nftDescription" rows="5"></textarea>
      </div>

      <div class="mb-3">
        <label for="nftImage" class="form-label">Image URL</label>
        <input v-model="nftImage" type="text" class="form-control" id="nftImage">
      </div>

      <div class="mb-3">
        <label for="nftMaxSupply" class="form-label">Maximum amount of NFT tokens</label>
        <input v-model="nftMaxSupply" type="text" class="form-control" id="nftMaxSupply">
      </div>

      <div class="mb-3">
        <label for="nftPrice" class="form-label">Price</label>
        <input 
          type="text"
          v-model="nftPrice" 
          placeholder="Any price in ETH; Can be 0 for discounts and similar offers." 
          class="form-control" id="nftPrice">
      </div>

      <button type="submit" @click="issueNft" class="btn btn-primary" :disabled="!isFormValid.status">Submit</button>

      <br>
      <small v-if="!isFormValid.status">{{isFormValid.message}}</small>
    </div>
  </div>
</template>
