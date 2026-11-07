<template>
  <div>
    <Main />
    <Envelope />
    <Invitation />
    <Schedule />
    <Gallery />
  </div>
</template>

<script>
import Main from '~/components/Main.vue';
import Envelope from '~/components/Envelope.vue';
import Invitation from '~/components/Invitation.vue';
import Schedule from '~/components/Schedule.vue';
import Gallery from '~/components/Gallery.vue';

export default {
  components: {
    Main,
    Envelope,
    Invitation,
    Schedule,
    Gallery,
  },
};
</script>

<style lang="scss" scoped>
</style>
