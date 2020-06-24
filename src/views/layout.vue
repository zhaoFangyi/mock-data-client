<template>
  <div>
    <top-bar></top-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import topBar from '@/components/top-bar'

export default {
  name: 'Home',
  components: {
    topBar
  }
}
</script>
