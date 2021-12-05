<script setup lang="ts">

</script>

<template>
  <div class="text-center">
    <h1>Create a Coupon or Voucher as NFT</h1>

    <div class="col-md-6 offset-md-3 mt-5">
      <div class="mb-3">
        <label for="nftTitleInput" class="form-label">NFT title</label>
        <input type="text" placeholder="20% discount on product XYZ" class="form-control" id="nftTitleInput" aria-describedby="titleHelp">
        <div id="titleHelp" class="form-text">Short title for your offer.</div>
      </div>

      <div class="mb-3">
        <label for="nftDescription" class="form-label">Description</label>
        <textarea 
          type="text" 
          placeholder="We offer you a 20% discount on XYZ which you can buy on our website example.org" 
          class="form-control" id="nftDescription" rows="5"></textarea>
      </div>

      <div class="mb-3">
        <label for="nftImage" class="form-label">Image URL</label>
        <input type="text" class="form-control" id="nftImage">
      </div>

      <div class="mb-3">
        <label for="nftMaxSupply" class="form-label">Maximum amount of NFT tokens</label>
        <input type="text" class="form-control" id="nftMaxSupply">
      </div>

      <div class="mb-3">
        <label for="nftPrice" class="form-label">Price</label>
        <input 
          type="text" 
          placeholder="Any price in ETH; Can be 0 for discounts and similar offers." 
          class="form-control" id="nftPrice">
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </div>
</template>
