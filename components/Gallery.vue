<template>
  <v-container id="gallery">
    <div>
      <div class="invite_eyebrow">Memories</div>
      <div class="title_text">ຄັງຮູບພາບ</div>
      <div class="sub_title">
        ພາບແຫ່ງຄວາມປະທັບໃຈ ແລະ ຄວາມຊົງຈຳຂອງພວກເຮົາ
      </div>
      <div class="invite_divider  mb-5"></div>
    </div>
    <!-- loading -->
    <v-row v-if="loading" justify="center" class="py-12">
      <v-progress-circular indeterminate color="#c8a562" size="48" />
    </v-row>

    <!-- error -->
    <v-row v-else-if="error" justify="center" class="py-8">
      <div class="text-center">
        <div class="mb-3">ບໍ່ສາມາດໂຫຼດຮູບພາບໄດ້</div>
        <v-btn outlined class="show_more_btn" @click="fetchImages"
          >ລອງໃໝ່</v-btn
        >
      </div>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="(item, i) in visibleImages"
        :key="item.id"
        cols="6"
        sm="4"
      >
        <div class="gallery_thumb" @click="open(i)">
          <img
            v-if="tiles[item.id] && tiles[item.id].src"
            :src="tiles[item.id].src"
            :alt="item.name"
            class="gallery_thumb_img"
            :class="{ 'is-ready': tiles[item.id].status === 'ok' }"
            decoding="async"
            referrerpolicy="no-referrer"
            @load="onThumbLoad(item)"
            @error="onThumbError(item)"
          />

          <!-- ກຳລັງໂຫຼດ / ໂຫຼດບໍ່ສຳເລັດ -->
          <div
            v-if="!tiles[item.id] || tiles[item.id].status !== 'ok'"
            class="gallery_thumb_state"
          >
            <v-progress-circular
              v-if="!tiles[item.id] || tiles[item.id].status !== 'failed'"
              indeterminate
              color="#c8a562"
              size="26"
              width="2"
            />
            <v-btn
              v-else
              icon
              small
              aria-label="ລອງໂຫຼດຮູບໃໝ່"
              @click.stop="retryThumb(item)"
            >
              <v-icon color="#c8a562" size="26">mdi-refresh</v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <div
      class="show_more_btn_long"
      v-if="!loading && !error && images.length > step && hasMore"
    >
      <v-btn
        @click="showMore()"
        text
        block
        color="#c8a562"
        style="border-radius: 0px"
        >show more <v-icon right size="20">mdi-chevron-down</v-icon></v-btn
      >
    </div>

    <v-row
      v-if="!loading && !error && images.length > step && !hasMore"
      justify="center"
      class="mt-6 mb-2"
    >
      <v-btn
        outlined
        large
        class="show_more_btn"
        @click="hasMore ? showMore() : showLess()"
      >
        Show less
        <v-icon right size="20">mdi-chevron-up </v-icon>
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

        <v-progress-circular
          v-if="imgLoading"
          indeterminate
          color="#c8a562"
          size="48"
          class="lightbox_spinner"
        />

        <div v-if="imgFailed" class="lightbox_failed">
          <div class="mb-3">ບໍ່ສາມາດໂຫຼດຮູບນີ້ໄດ້</div>
          <v-btn outlined class="show_more_btn" @click.stop="retryCurrent">
            ລອງໃໝ່
          </v-btn>
        </div>

        <img
          v-if="current && !imgFailed"
          :key="index + '-' + attempt"
          :src="currentSrc"
          :alt="current.name"
          class="lightbox_image"
          :class="{ 'is-loading': imgLoading }"
          referrerpolicy="no-referrer"
          @load="imgLoading = false"
          @error="onImgError"
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

        <div class="lightbox_counter">
          {{ index + 1 }} / {{ images.length }}
        </div>
      </div>
    </v-dialog>
  </v-container>
</template>

<script>
// Drive/lh3 ຈຳກັດ quota ຕໍ່ IP: ຍິງພ້ອມກັນຫຼາຍເກີນ -> ຕອບ 429 ເປັນ HTML
// ແລ້ວ Chrome ບລັອກດ້ວຍ ORB (net::ERR_BLOCKED_BY_ORB) -> ຮູບໂຫຼດບໍ່ຂຶ້ນ
// ຈຶ່ງຕ້ອງຈຳກັດຈຳນວນທີ່ໂຫຼດພ້ອມກັນ ແລະ ລອງໃໝ່ແບບຖ່າງເວລາ
const MAX_PARALLEL = 3;
const RETRY_DELAYS = [700, 1800, 4000, 8000];

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
      imgLoading: false,
      imgFailed: false,
      attempt: 0,
      images: [],
      tiles: {}, // id -> { src, status: 'idle'|'loading'|'ok'|'failed', tries }
    };
  },
  computed: {
    current() {
      return this.images[this.index] || null;
    },
    currentSrc() {
      if (!this.current) return "";
      const list = this.sources(this.current);
      return list[Math.min(this.attempt, list.length - 1)];
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
    // ກົດ show more -> ເອົາຮູບຊຸດໃໝ່ເຂົ້າຄິວ
    visibleImages: {
      immediate: true,
      handler() {
        this.$nextTick(this.pump);
      },
    },
    viewer(open) {
      if (open) window.addEventListener("keydown", this.onKey);
      else window.removeEventListener("keydown", this.onKey);
    },
  },
  mounted() {
    this.fetchImages();
  },
  created() {
    // ບໍ່ຕ້ອງເປັນ reactive: ໃຊ້ຄຸມຄິວເທົ່ານັ້ນ
    this.active = 0;
    this.retryTimers = [];
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onKey);
    this.retryTimers.forEach(clearTimeout);
    this.retryTimers = [];
  },
  methods: {
    async fetchImages() {
      this.loading = true;
      this.error = false;
      try {
        const data = await this.$axios.$get(GALLERY_API);
        this.images = (Array.isArray(data) ? data : []).filter(
          (item) => item && item.id && item.url && item.thumbnail
        );
        this.pages = 1;
        this.resetTiles();
      } catch (e) {
        this.error = true;
        this.images = [];
      } finally {
        this.loading = false;
      }
    },
    resetTiles() {
      this.retryTimers.forEach(clearTimeout);
      this.retryTimers = [];
      this.active = 0;
      const tiles = {};
      this.images.forEach((item) => {
        tiles[item.id] = { src: "", status: "idle", tries: 0 };
      });
      this.tiles = tiles;
    },
    // ສະລັບ CDN ແລະ ຂະໜາດໜ້ອຍໜຶ່ງທຸກຄັ້ງທີ່ລອງໃໝ່ ເພື່ອບໍ່ໃຫ້ຕິດ cache ຂອງ 429
    thumbUrl(item, tries) {
      const width = 400 + tries;
      return tries % 2 === 0
        ? "https://lh3.googleusercontent.com/d/" + item.id + "=w" + width
        : "https://drive.google.com/thumbnail?id=" + item.id + "&sz=w" + width;
    },
    // ປ່ອຍຮູບເຂົ້າໂຫຼດເທື່ອລະ MAX_PARALLEL ຮູບ ແທນການຍິງພ້ອມກັນໝົດ
    pump() {
      for (const item of this.visibleImages) {
        if (this.active >= MAX_PARALLEL) return;
        const tile = this.tiles[item.id];
        if (!tile || tile.status !== "idle") continue;
        tile.status = "loading";
        tile.src = this.thumbUrl(item, tile.tries);
        this.active += 1;
      }
    },
    onThumbLoad(item) {
      const tile = this.tiles[item.id];
      if (!tile || tile.status !== "loading") return;
      tile.status = "ok";
      this.active = Math.max(0, this.active - 1);
      this.pump();
    },
    onThumbError(item) {
      const tile = this.tiles[item.id];
      if (!tile || tile.status !== "loading") return;
      this.active = Math.max(0, this.active - 1);

      if (tile.tries >= RETRY_DELAYS.length) {
        tile.status = "failed";
        this.pump();
        return;
      }

      // ຖ່າງເວລາກ່ອນລອງໃໝ່ ເພື່ອໃຫ້ quota ຂອງ Google ຄືນມາ.
      // ຕ້ອງໝາຍເປັນ "waiting" ບໍ່ແມ່ນ "idle" ບໍ່ດັ່ງນັ້ນ pump() ດ້ານລຸ່ມ
      // ຈະດຶງມັນກັບມາຍິງໃໝ່ທັນທີ ແລ້ວການຖ່າງເວລາກໍ່ບໍ່ມີຜົນ
      const delay = RETRY_DELAYS[tile.tries];
      tile.tries += 1;
      tile.status = "waiting";
      tile.src = "";
      this.retryTimers.push(
        setTimeout(() => {
          if (tile.status !== "waiting") return;
          tile.status = "idle";
          this.pump();
        }, delay)
      );
      // ປ່ອຍຮູບອື່ນທີ່ລໍຖ້າຢູ່ເຂົ້າໄປແທນບ່ອນຫວ່າງ
      this.pump();
    },
    retryThumb(item) {
      const tile = this.tiles[item.id];
      if (!tile) return;
      tile.tries = 0;
      tile.status = "idle";
      tile.src = "";
      this.pump();
    },
    showMore() {
      this.pages += 1;
    },
    showLess() {
      this.pages = 1;
      const el = this.$el.querySelector(".gallery_thumb");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    // ໄລ່ URL ສຳຮອງ: lh3 ກ່ອນ (ບໍ່ຕ້ອງຜ່ານ 302) -> drive -> thumbnail ນ້ອຍ
    sources(item) {
      const list = [
        item.id
          ? "https://lh3.googleusercontent.com/d/" + item.id + "=w1600"
          : null,
        item.url,
        item.id
          ? "https://lh3.googleusercontent.com/d/" + item.id + "=w1200"
          : null,
        item.thumbnail,
      ];
      return list.filter((v, i, arr) => v && arr.indexOf(v) === i);
    },
    onImgError() {
      if (!this.current) return;
      if (this.attempt < this.sources(this.current).length - 1) {
        this.attempt += 1;
        return;
      }
      // ໝົດທາງເລືອກແລ້ວ -> ຢຸດ spinner ແລ້ວໃຫ້ຜູ້ໃຊ້ກົດລອງໃໝ່ເອງ
      this.imgLoading = false;
      this.imgFailed = true;
    },
    retryCurrent() {
      this.attempt = 0;
      this.imgFailed = false;
      this.imgLoading = true;
    },
    showAt(index) {
      this.index = index;
      this.attempt = 0;
      this.imgFailed = false;
      this.imgLoading = true;
    },
    open(index) {
      this.showAt(index);
      this.viewer = true;
    },
    close() {
      this.viewer = false;
      this.imgLoading = false;
      this.imgFailed = false;
    },
    next() {
      this.showAt((this.index + 1) % this.images.length);
    },
    prev() {
      this.showAt((this.index - 1 + this.images.length) % this.images.length);
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
  position: relative;
  width: 100%;
  padding-top: 100%; // ຮູບສີ່ຫຼ່ຽມຈັດຕຸລັດ (ແທນ aspect-ratio ຂອງ v-img)
  overflow: hidden;
  border-radius: 4px;
  background-color: #eeeeee;
  cursor: pointer;
  transition: transform 0.35s ease, filter 0.35s ease;

  &:hover {
    transform: scale(1.02);
    filter: brightness(0.85);
  }
}

.gallery_thumb_img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity 0.4s ease;

  &.is-ready {
    opacity: 1;
  }
}

.gallery_thumb_state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox_failed {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
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
  transition: opacity 0.25s ease;
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

  &.is-loading {
    opacity: 0;
  }
}

.lightbox_spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.show_more_btn_long {
  display: flex;
  align-items: end;
  justify-content: center;
  position: relative;
  right: 0;
  left: 0;
  z-index: 99;
  background: #000000;
  height: 60px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 100%
  );
  letter-spacing: 1px;
  margin-top: -70px;
}

.sub_title {
  text-align: center;
  color: #8c8275;
  font-size: clamp(13px, 3.4vw, 15px);
  padding: 0 16px;
}
.title_text {
  text-align: center;
  color: #2d3748;
  font-size: clamp(22px, 6vw, 34px);
  font-weight: 700;
  line-height: 1.25;
  padding: 0 16px;
}
.invite_eyebrow {
  text-align: center;
  font-family: "Great Vibes", cursive !important;
  color: #c8a562;
  font-size: clamp(24px, 7vw, 32px);
  line-height: 1.2;
}

.invite_divider {
  width: 70px;
  height: 2px;
  background-color: #c8a562;
  margin: 12px auto 0;
}
</style>
