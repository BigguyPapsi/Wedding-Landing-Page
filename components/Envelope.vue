<template>
  <div id="envelope" class="invite_section">
    <div class="invite_head">
      <div class="invite_eyebrow">Exclusive Invitation</div>
      <h2 class="invite_title">ບັດເຊີນ &amp; ຮູບພາບຄວາມຊົງຈຳ</h2>
      <div class="invite_sub">
        ກົດທີ່ກາຄັ່ງ (Wax Seal) ຫຼື ຊອງຈົດໝາຍ ເພື່ອເປີດບັດເຊີນ
      </div>
      <div class="invite_divider"></div>
    </div>

    <!-- ຊອງຈົດໝາຍ -->
    <div class="envelope_wrap">
      <div
        class="envelope"
        :class="{ 'is-open': isOpen }"
        role="button"
        tabindex="0"
        aria-label="ເປີດບັດເຊີນ"
        @click="openEnvelope"
        @keydown.enter.prevent="openEnvelope"
        @keydown.space.prevent="openEnvelope"
      >
        <div class="env_back"></div>

        <!-- ບັດທີ່ຢູ່ໃນຊອງ -->
        <div class="env_paper">
          <div class="paper_top">
            <span class="paper_label">WEDDING PHOTO GALLERY</span>
            <span class="paper_close">&times; ປິດ</span>
          </div>
          <div class="paper_photo">
            <img :src="photos[0].src" :alt="coupleName" @error="onImgError" />
            <span class="paper_counter">{{ photos.length }} / {{ photos.length }}</span>
          </div>
        </div>

        <div class="env_front"></div>
        <div class="env_flap"></div>

        <div class="wax_seal">
          <v-icon color="white" size="22">mdi-heart</v-icon>
        </div>
      </div>
    </div>

    <!-- ແກລເລີຣີຮູບ -->
    <v-dialog
      v-model="dialog"
      max-width="520"
      overlay-color="#2d3748"
      overlay-opacity="0.45"
      @keydown.left="prev"
      @keydown.right="next"
      @input="onDialogToggle"
    >
      <div class="gallery">
        <div class="gallery_head">
          <span class="gallery_label">WEDDING PHOTO GALLERY</span>
          <span class="gallery_couple">{{ coupleName }}</span>
          <button class="gallery_close" type="button" @click="closeGallery">
            &times; ປິດ
          </button>
        </div>

        <div class="gallery_stage">
          <img
            :src="activePhoto.src"
            :alt="activePhoto.caption"
            class="gallery_img"
            @error="onImgError"
          />
          <span class="gallery_counter">{{ index + 1 }} / {{ photos.length }}</span>

          <button
            class="nav_btn nav_prev"
            type="button"
            aria-label="ຮູບກ່ອນໜ້າ"
            @click="prev"
          >
            <v-icon size="20" color="#2d3748">mdi-chevron-left</v-icon>
          </button>
          <button
            class="nav_btn nav_next"
            type="button"
            aria-label="ຮູບຕໍ່ໄປ"
            @click="next"
          >
            <v-icon size="20" color="#2d3748">mdi-chevron-right</v-icon>
          </button>
        </div>

        <div class="gallery_foot">
          <span class="gallery_caption">{{ index + 1 }}. {{ activePhoto.caption }}</span>
          <span class="gallery_dots">
            <button
              v-for="(photo, i) in photos"
              :key="photo.src + i"
              type="button"
              class="dot"
              :class="{ 'dot--active': i === index }"
              :aria-label="'ຮູບທີ ' + (i + 1)"
              @click="index = i"
            ></button>
          </span>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
const FALLBACK_IMG = "/img/main_image.jpg";

// ວາງຮູບຈິງໄວ້ທີ່ static/img/gallery/01.jpg ... 10.jpg
const DEFAULT_PHOTOS = [
  { src: "/img/gallery/01.jpg", caption: "ຮູບຖ່າຍພຣີເວັດດິ້ງຢ່າງເປັນທາງການ" },
  { src: "/img/gallery/02.jpg", caption: "ມື້ສູ່ຂໍ" },
  { src: "/img/gallery/03.jpg", caption: "ແຫວນແຕ່ງງານ" },
  { src: "/img/gallery/04.jpg", caption: "ຊໍ່ດອກໄມ້ເຈົ້າສາວ" },
  { src: "/img/gallery/05.jpg", caption: "ຮູບຄູ່ກາງແຈ້ງ" },
  { src: "/img/gallery/06.jpg", caption: "ຊຸດແຕ່ງງານ" },
  { src: "/img/gallery/07.jpg", caption: "ສະຖານທີ່ຈັດງານ" },
  { src: "/img/gallery/08.jpg", caption: "ຮູບກັບຄອບຄົວ" },
  { src: "/img/gallery/09.jpg", caption: "ຮູບກັບໝູ່ເພື່ອນ" },
  { src: "/img/gallery/10.jpg", caption: "ຄວາມຊົງຈຳທີ່ດີທີ່ສຸດ" },
];

export default {
  name: "Envelope",
  props: {
    coupleName: {
      type: String,
      default: "Manethong & Kedmany",
    },
    photos: {
      type: Array,
      default: () => DEFAULT_PHOTOS,
    },
  },
  data() {
    return {
      isOpen: false,
      dialog: false,
      index: 0,
      openTimer: null,
    };
  },
  computed: {
    activePhoto() {
      return this.photos[this.index] || { src: FALLBACK_IMG, caption: "" };
    },
  },
  beforeDestroy() {
    clearTimeout(this.openTimer);
  },
  methods: {
    openEnvelope() {
      if (this.dialog) return;
      this.isOpen = true;
      this.index = 0;
      // ລໍຖ້າໃຫ້ຝາຊອງເປີດກ່ອນ ຈຶ່ງຄ່ອຍສະແດງແກລເລີຣີ
      this.openTimer = setTimeout(() => {
        this.dialog = true;
      }, 450);
    },
    closeGallery() {
      this.dialog = false;
      this.isOpen = false;
    },
    onDialogToggle(value) {
      // ປິດດ້ວຍປຸ່ມ esc ຫຼື ກົດນອກກ່ອງ
      if (!value) this.isOpen = false;
    },
    prev() {
      this.index = (this.index - 1 + this.photos.length) % this.photos.length;
    },
    next() {
      this.index = (this.index + 1) % this.photos.length;
    },
    onImgError(event) {
      if (event.target.getAttribute("src") === FALLBACK_IMG) return;
      event.target.src = FALLBACK_IMG;
    },
  },
};
</script>

<style lang="scss" scoped>
$beige: #e8d5bc;
$beige-dark: #dcc5a6;
$gold: #c8a562;
$ink: #2d3748;

.invite_section {
  background-color: #ffffff;
  padding: 60px 16px 80px;
  scroll-margin-top: 70px;
}

.invite_head {
  text-align: center;
}
.invite_eyebrow {
  font-family: "Great Vibes", cursive !important;
  color: $gold;
  font-size: 32px;
  line-height: 1.2;
}
.invite_title {
  color: $ink;
  font-size: 34px;
  font-weight: 700;
  margin: 6px 0 8px;
}
.invite_sub {
  color: #8c8275;
  font-size: 15px;
}
.invite_divider {
  width: 70px;
  height: 2px;
  background-color: $gold;
  margin: 12px auto 0;
}

/* ---------- ຊອງຈົດໝາຍ ---------- */
.envelope_wrap {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}
.envelope {
  position: relative;
  width: 540px;
  max-width: 100%;
  height: 340px;
  cursor: pointer;
  outline: none;
}
.envelope:focus-visible .env_back {
  box-shadow: 0 0 0 3px rgba(200, 165, 98, 0.6);
}

.env_back {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: $beige;
  border-radius: 12px;
  transition: box-shadow 0.25s ease;
}

.env_paper {
  position: absolute;
  top: 18px;
  left: 7%;
  right: 7%;
  bottom: 40px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(45, 55, 72, 0.12);
  overflow: hidden;
  z-index: 2;
  transition: transform 0.45s ease;
}
.envelope.is-open .env_paper {
  transform: translateY(-26px);
}
.paper_top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 8px;
}
.paper_label {
  color: $gold;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
}
.paper_close {
  color: #8c8275;
  font-size: 11px;
  border: 1px solid #e3e0da;
  border-radius: 6px;
  padding: 2px 8px;
}
.paper_photo {
  position: relative;
  margin: 0 12px;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
.paper_counter {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(45, 55, 72, 0.7);
  color: #ffffff;
  font-size: 11px;
  border-radius: 6px;
  padding: 2px 8px;
}

/* ກະເປົາດ້ານໜ້າຂອງຊອງ (ຮູບ V) */
.env_front {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: $beige;
  border-radius: 12px;
  clip-path: polygon(0 32%, 50% 92%, 100% 32%, 100% 100%, 0 100%);
  z-index: 3;
}

/* ຝາຊອງ */
.env_flap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 62%;
  background-color: $beige-dark;
  border-radius: 12px 12px 0 0;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: top center;
  transform: rotateX(0deg);
  transition: transform 0.45s ease, z-index 0s linear 0.22s;
  z-index: 4;
}
.envelope.is-open .env_flap {
  transform: rotateX(-172deg);
  z-index: 1;
}

.wax_seal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: $gold;
  box-shadow: 0 3px 10px rgba(200, 165, 98, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.envelope:hover .wax_seal {
  transform: translate(-50%, -50%) scale(1.08);
}
.envelope.is-open .wax_seal {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.6);
}

/* ---------- ແກລເລີຣີ ---------- */
.gallery {
  background-color: #ffffff;
  border-radius: 14px;
  padding: 14px;
}
.gallery_head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 2px 12px;
}
.gallery_label {
  color: $gold;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  flex: 1;
}
.gallery_couple {
  color: $ink;
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
}
.gallery_close {
  flex: 1;
  text-align: right;
  color: #8c8275;
  font-size: 12px;
  cursor: pointer;
}

.gallery_stage {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f1ede6;
}
.gallery_img {
  display: block;
  width: 100%;
  height: 380px;
  object-fit: cover;
}
.gallery_counter {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(45, 55, 72, 0.7);
  color: #ffffff;
  font-size: 12px;
  border-radius: 6px;
  padding: 2px 10px;
}
.nav_btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 2px 8px rgba(45, 55, 72, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.nav_prev {
  left: 10px;
}
.nav_next {
  right: 10px;
}

.gallery_foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 2px 2px;
}
.gallery_caption {
  color: #6b6459;
  font-size: 13px;
}
.gallery_dots {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #ded9d0;
  cursor: pointer;
  padding: 0;
  transition: width 0.2s ease, background-color 0.2s ease;
}
.dot--active {
  width: 16px;
  border-radius: 4px;
  background-color: $gold;
}

@media (max-width: 600px) {
  .invite_title {
    font-size: 24px;
  }
  .envelope {
    height: 240px;
  }
  .gallery_img {
    height: 280px;
  }
  .gallery_couple {
    font-size: 15px;
  }
}
</style>
