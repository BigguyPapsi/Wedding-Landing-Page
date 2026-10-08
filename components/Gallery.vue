<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(item, i) in visibleImages"
        :key="i"
        class="d-flex child-flex"
        cols="6"
        sm="4"
      >
        <v-img
          :src="item.src"
          :lazy-src="tiny(item.src)"
          :alt="item.alt + ' ' + (i + 1)"
          aspect-ratio="1"
          class="grey lighten-2 gallery_thumb"
          @click.native="open(i)"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>

    <v-row v-if="images.length > step" justify="center" class="mt-6 mb-2">
      <v-btn
        outlined
        large
        class="show_more_btn"
        @click="hasMore ? showMore() : showLess()"
      >
        {{ hasMore ? "Show more" : "Show less" }}
        <v-icon right size="20">{{
          hasMore ? "mdi-chevron-down" : "mdi-chevron-up"
        }}</v-icon>
      </v-btn>
    </v-row>

    <!-- Lightbox -->
    <v-dialog
      v-model="viewer"
      fullscreen
      hide-overlay
      transition="fade-transition"
      content-class="lightbox_dialog"
    >
      <div class="lightbox" @click.self="close">
        <v-btn icon dark class="lightbox_close" @click="close">
          <v-icon size="34">mdi-close</v-icon>
        </v-btn>

        <v-btn
          v-if="images.length > 1"
          icon
          dark
          class="lightbox_nav lightbox_prev"
          @click.stop="prev"
        >
          <v-icon size="40">mdi-chevron-left</v-icon>
        </v-btn>

        <img
          v-if="current"
          :key="index"
          :src="full(current.src)"
          :alt="current.alt"
          class="lightbox_image"
        />

        <v-btn
          v-if="images.length > 1"
          icon
          dark
          class="lightbox_nav lightbox_next"
          @click.stop="next"
        >
          <v-icon size="40">mdi-chevron-right</v-icon>
        </v-btn>

        <div class="lightbox_counter">{{ index + 1 }} / {{ images.length }}</div>
      </div>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      viewer: false,
      index: 0,
      pages: 1,
      images: [
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867162063376474/SM701742.jpg?backend=b2&ex=6ac5b908&is=6ac46788&hm=e0b4dc581c70e77f10e10360f41625e60f5ee339090b1b74efb70e5ed4adbeca&=&format=webp&width=512&height=768",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867163887767592/SM701737.jpg?backend=b2&ex=6ac5b909&is=6ac46789&hm=e39fe60fb77a63b75a01fded9d097dc6de348710d9694f984a7b61d3181241e0&=&format=webp&width=512&height=768",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867165326417961/SM701734.jpg?backend=b2&ex=6ac5b909&is=6ac46789&hm=f70ae62aad1252d70000a7e9a6bdaabfd045a1b9227fc880d58d4fc617dc3b58&=&format=webp&width=512&height=768",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867166379180032/SM701735.jpg?backend=b2&ex=6ac5b909&is=6ac46789&hm=285c54e6a955e7df7e8630e01a2b61b582f975283747c3b16f07e8bdc3326f18&=&format=webp&width=512&height=768",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867167381889074/SM701732.jpg?backend=b2&ex=6ac5b909&is=6ac46789&hm=3fa3d0a59f120022523ca24383021d079f3755a36525a38f2e2c5406daeb71a9&=&format=webp&width=1280&height=853",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867168644108368/SM701767.jpg?backend=b2&ex=6ac5b90a&is=6ac4678a&hm=2eb9a5c34c1b6fffb675541364da3a0029a33dbec212c060f04fc27dbe9a2909&=&format=webp&width=1280&height=853",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867169680228512/SM701765.jpg?backend=b2&ex=6ac5b90a&is=6ac4678a&hm=464d40dc2e22c40fec8edd8db905686e97d89bf905f600afb2e45cd86e0fff17&=&format=webp&width=512&height=768",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867170728935465/SM701758.jpg?backend=b2&ex=6ac5b90a&is=6ac4678a&hm=ba007eeaa984e12e7595ec58b0105c8ee63be0a6a1ba1accf2b0a85e75cd0843&=&format=webp&width=1280&height=853",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867171676852345/SM701749.jpg?backend=b2&ex=6ac5b90a&is=6ac4678a&hm=7ee44c22c4501eee42ee7836bc46511bf1761186b04a513482939ae7659da5d5&=&format=webp&width=1280&height=853",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867172389625948/SM701747.jpg?backend=b2&ex=6ac5b90b&is=6ac4678b&hm=e66f422bdfe1d4b43307090b6989cb3d76457d8486366a9f5db0dce59b221742&=&format=webp&width=512&height=768",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867433002705020/SM701707.jpg?backend=b2&ex=6ac5b949&is=6ac467c9&hm=d5731df2e6df1df71d066cd0eb92f64f53713afcea39ae8c2dc4b5d493d8419f&=&format=webp&width=512&height=768",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867434298740757/SM701706.jpg?backend=b2&ex=6ac5b949&is=6ac467c9&hm=e3c4be95b6701b993f88b797934e7a906822b1b38c096462045124c4da9ea145&=&format=webp&width=512&height=768",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867435574071327/SM701700.jpg?backend=b2&ex=6ac5b949&is=6ac467c9&hm=41d6fc4085200f6b266635ef746def4093555c7cfbb87604e371fee1cbffe9ad&=&format=webp&width=512&height=768",
          alt: "Gallery Image",
        },
        {
          src: "https://media.discordapp.net/attachments/898893230928711750/1556867436576243742/SM701699.jpg?backend=b2&ex=6ac5b94a&is=6ac467ca&hm=6be6fffe50a371b812b683620a8c52016cfb1d64ff945071ec4dc7b6ac0e0d9a&=&format=webp&width=512&height=768",
          alt: "Gallery Image",
        },
        {
          src: "",
          alt: "Gallery Image",
        },
        {
          src: "",
          alt: "Gallery Image",
        },
      ],
    };
  },
  computed: {
    current() {
      return this.images[this.index] || null;
    },
    // จอใหญ่กริด 3 คอลัมน์ -> 9 รูป, มือถือกริด 2 คอลัมน์ -> 10 รูป (แถวเต็มพอดีทั้งคู่)
    step() {
      return this.$vuetify.breakpoint.xsOnly ? 10 : 9;
    },
    visibleCount() {
      return Math.min(this.pages * this.step, this.images.length);
    },
    visibleImages() {
      return this.images.slice(0, this.visibleCount);
    },
    hasMore() {
      return this.visibleCount < this.images.length;
    },
  },
  watch: {
    viewer(open) {
      if (open) window.addEventListener("keydown", this.onKey);
      else window.removeEventListener("keydown", this.onKey);
    },
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onKey);
  },
  methods: {
    // ย่อ query ของ CDN ให้เหลือภาพจิ๋วสำหรับ blur placeholder
    tiny(src) {
      return this.resize(src, 16, 24);
    },
    // ภาพความละเอียดสูงสำหรับ lightbox (CDN ย่อให้พอดีกรอบ โดยคงสัดส่วนเดิม)
    full(src) {
      return this.resize(src, 1600, 1600);
    },
    resize(src, w, h) {
      return src.replace(/width=\d+/, "width=" + w).replace(/height=\d+/, "height=" + h);
    },
    showMore() {
      this.pages += 1;
    },
    showLess() {
      this.pages = 1;
      const el = this.$el.querySelector(".gallery_thumb");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    open(index) {
      this.index = index;
      this.viewer = true;
    },
    close() {
      this.viewer = false;
    },
    next() {
      this.index = (this.index + 1) % this.images.length;
    },
    prev() {
      this.index = (this.index - 1 + this.images.length) % this.images.length;
    },
    onKey(e) {
      if (e.key === "Escape") this.close();
      else if (e.key === "ArrowRight") this.next();
      else if (e.key === "ArrowLeft") this.prev();
    },
  },
};
</script>

<style lang="scss" scoped>
.gallery_thumb {
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.35s ease, filter 0.35s ease;

  &:hover {
    transform: scale(1.02);
    filter: brightness(0.85);
  }
}

.show_more_btn {
  border-color: #c8a562 !important;
  color: #c8a562 !important;
  letter-spacing: 1px;
}

.lightbox {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 18, 15, 0.94);
}

.lightbox_image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox_close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
}

.lightbox_nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.lightbox_prev {
  left: 12px;
}

.lightbox_next {
  right: 12px;
}

.lightbox_close:hover ::v-deep .v-icon,
.lightbox_nav:hover ::v-deep .v-icon {
  color: #c8a562;
}

.lightbox_counter {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  letter-spacing: 1px;
}

@media (max-width: 600px) {
  .lightbox_image {
    max-width: 94vw;
  }

  .lightbox_prev {
    left: 2px;
  }

  .lightbox_next {
    right: 2px;
  }
}
</style>

<style>
.lightbox_dialog {
  box-shadow: none;
  overflow: hidden;
}
</style>
