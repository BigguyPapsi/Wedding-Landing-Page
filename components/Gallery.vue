<template>
  <v-container>
    <!-- loading -->
    <v-row v-if="loading" justify="center" class="py-12">
      <v-progress-circular indeterminate color="#c8a562" size="48" />
    </v-row>

    <!-- error -->
    <v-row v-else-if="error" justify="center" class="py-8">
      <div class="text-center">
        <div class="mb-3">ບໍ່ສາມາດໂຫຼດຮູບພາບໄດ້</div>
        <v-btn outlined class="show_more_btn" @click="fetchImages">ລອງໃໝ່</v-btn>
      </div>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="(item, i) in visibleImages"
        :key="item.id"
        class="d-flex child-flex"
        cols="6"
        sm="4"
      >
        <v-img
          :src="item.thumbnail"
          :lazy-src="tiny(item.thumbnail)"
          :alt="item.name"
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

    <v-row v-if="!loading && !error && images.length > step" justify="center" class="mt-6 mb-2">
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
          :src="current.url"
          :alt="current.name"
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
// Google Apps Script -> รายการรูปจาก Google Drive
const GALLERY_API =
  "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnRRDuZTQPEBvsUw_-z1csA_noBMciwu2_8WKGJWIT0FCeMpYhaqd6q2F3g8mJLvrMsR_2BHRZQW310QtxTelnWjFcbkkPLnW9gmxeY3bidwHW8gbGDZG6YfCsyDoTZmThEmHNzZ03eqQMh9qDLI-hnd7KXG9gn867ikW33Tyo6zBCpqDzZt28BKULIW7LfAj4Xext_OI4DHjDDXh5UOcO2qn0JpAuyvnwNAXbYkfNK4TiMK1yvSXcA53J-WXvbgr03zC01hTCnkRqvZ0BSmTdxxEIYBNQ&lib=MNkjABtIcSETLRPeV4zTlcOJ3fRlXzQz9";

export default {
  data() {
    return {
      viewer: false,
      index: 0,
      pages: 1,
      loading: true,
      error: false,
      images: [],
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
  mounted() {
    this.fetchImages();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onKey);
  },
  methods: {
    async fetchImages() {
      this.loading = true;
      this.error = false;
      try {
        const data = await this.$axios.$get(GALLERY_API);
        this.images = (Array.isArray(data) ? data : []).filter(
          (item) => item && item.url && item.thumbnail
        );
        this.pages = 1;
      } catch (e) {
        this.error = true;
        this.images = [];
      } finally {
        this.loading = false;
      }
    },
    // ย่อ thumbnail ของ Drive ให้เหลือภาพจิ๋วสำหรับ blur placeholder
    tiny(src) {
      return src.replace(/sz=w\d+/, "sz=w16");
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
