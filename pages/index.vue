<template>
  <div>
    <Main />
    <Envelope />
    <Schedule />
  </div>
</template>

<script>
import Main from '~/components/Main.vue';
import Envelope from '~/components/Envelope.vue';

export default {
  components: { Main, Envelope },
};
</script>

<style lang="scss" scoped>
</style>
