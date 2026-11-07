<template>
  <div id="invitation" class="invite_section">
    <div class="invite_head">
      <div class="invite_eyebrow">Exclusive Invitation</div>
      <h2 class="invite_title">ໃບບັດເຊີນງານດອງ</h2>
      <div class="invite_sub">
        ຂໍຮຽນເຊີນທ່ານ ພ້ອມດ້ວຍຄອບຄົວ ຮ່ວມເປັນກຽດໃນງານແຕ່ງດອງຂອງພວກເຮົາ
      </div>
      <div class="invite_divider"></div>
    </div>

    <v-container class="invitation_container">
      <div class="card_wrapper">
        <div
          class="card_container"
          role="button"
          tabindex="0"
          aria-label="ເບິ່ງບັດເຊີນຂະໜາດເຕັມຈໍ"
          @click="openViewer"
          @keydown.enter.prevent="openViewer"
          @keydown.space.prevent="openViewer"
        >
          <img
            :src="cardImage"
            alt="Wedding Invitation - Manethong & Kedmany"
            class="invitation_img"
          />
          <div class="card_overlay_badge">
            <v-icon small color="white" class="mr-1">mdi-magnify-plus</v-icon>
            ກົດເພື່ອຂະຫຍາຍເບິ່ງເຕັມຈໍ
          </div>
        </div>
      </div>
    </v-container>

    <!-- Fullscreen Lightbox ສຳລັບຂະຫຍາຍເບິ່ງບັດເຊີນ -->
    <v-dialog
      v-model="viewerOpen"
      fullscreen
      hide-overlay
      transition="fade-transition"
      content-class="invitation_lightbox_dialog"
    >
      <div class="lightbox" @click.self="closeViewer">
        <div class="lightbox_topbar">
          <div class="lightbox_title">
            <span class="lightbox_eyebrow">Wedding Invitation</span>
            <span class="lightbox_couple">Manethong &amp; Kedmany</span>
          </div>

          <div class="lightbox_actions">
            <button
              type="button"
              class="tool_btn"
              aria-label="ຊູມອອກ"
              :disabled="zoom <= 0.6"
              @click="zoomOut"
            >
              <v-icon size="20" color="white">mdi-minus</v-icon>
            </button>
            <span class="zoom_label">{{ Math.round(zoom * 100) }}%</span>
            <button
              type="button"
              class="tool_btn"
              aria-label="ຊູມເຂົ້າ"
              :disabled="zoom >= 2.5"
              @click="zoomIn"
            >
              <v-icon size="20" color="white">mdi-plus</v-icon>
            </button>
            <button
              type="button"
              class="tool_btn"
              aria-label="ຄືນຄ່າຂະໜາດເດີມ"
              @click="resetZoom"
            >
              <v-icon size="18" color="white">mdi-refresh</v-icon>
            </button>
            <button
              type="button"
              class="tool_btn tool_close"
              aria-label="ປິດ"
              @click="closeViewer"
            >
              <v-icon size="24" color="white">mdi-close</v-icon>
            </button>
          </div>
        </div>

        <div class="lightbox_stage">
          <div
            class="lightbox_img_wrap"
            :style="{ width: `${zoom * 100}%` }"
          >
            <img
              :src="cardImage"
              alt="Wedding Invitation Fullscreen"
              class="lightbox_img"
            />
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Invitation",
  props: {
    cardImage: {
      type: String,
      default: "/img/invitation_card.webp",
    },
  },
  data() {
    return {
      viewerOpen: false,
      zoom: 1,
    };
  },
  watch: {
    viewerOpen(val) {
      if (val) {
        this.zoom = 1;
        window.addEventListener("keydown", this.onKey);
      } else {
        window.removeEventListener("keydown", this.onKey);
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onKey);
  },
  methods: {
    openViewer() {
      this.viewerOpen = true;
      this.zoom = 1;
    },
    closeViewer() {
      this.viewerOpen = false;
      this.zoom = 1;
    },
    zoomIn() {
      this.zoom = Math.min(2.5, +(this.zoom + 0.25).toFixed(2));
    },
    zoomOut() {
      this.zoom = Math.max(0.6, +(this.zoom - 0.25).toFixed(2));
    },
    resetZoom() {
      this.zoom = 1;
    },
    onKey(e) {
      if (e.key === "Escape") {
        this.closeViewer();
      } else if (e.key === "+" || e.key === "=") {
        this.zoomIn();
      } else if (e.key === "-" || e.key === "_") {
        this.zoomOut();
      } else if (e.key === "0") {
        this.resetZoom();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.invite_section {
  background-color: var(--surface);
  padding: 60px 16px 80px;
}

.invite_head {
  text-align: center;
}
.invite_eyebrow {
  font-family: "Great Vibes", cursive !important;
  color: var(--brand-text);
  font-size: clamp(24px, 7vw, 32px);
  line-height: 1.2;
}
.invite_title {
  color: var(--ink);
  font-size: clamp(22px, 6vw, 34px);
  font-weight: 700;
  margin: 6px 0 8px;
}
.invite_sub {
  color: var(--muted);
  font-size: clamp(13px, 3.4vw, 15px);
  padding: 0 16px;
}
.invite_divider {
  width: 70px;
  height: 2px;
  background-color: var(--brand);
  margin: 12px auto 0;
}

.invitation_container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 36px 12px 0;
}

/* Card Mode */
.card_wrapper {
  display: flex;
  justify-content: center;
}
.card_container {
  position: relative;
  width: 100%;
  max-width: 960px;
  background-color: var(--surface);
  border-radius: 16px;
  border: 1px solid var(--brand);
  box-shadow: 0 8px 28px rgba(45, 55, 72, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  outline: none;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(45, 55, 72, 0.16);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(var(--brand-rgb), 0.6);
  }
}
.invitation_img {
  width: 100%;
  height: auto;
  display: block;
}

.card_overlay_badge {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background-color: rgba(45, 55, 72, 0.78);
  color: #ffffff;
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

/* Lightbox Dialog */
.lightbox {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(20, 18, 15, 0.95);
  display: flex;
  flex-direction: column;
}
.lightbox_topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}
.lightbox_title {
  display: flex;
  flex-direction: column;
}
.lightbox_eyebrow {
  font-family: "Great Vibes", cursive !important;
  color: var(--brand);
  font-size: 20px;
  line-height: 1.1;
}
.lightbox_couple {
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
}
.lightbox_actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tool_btn {
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.25);
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}
.tool_close {
  background: rgba(255, 255, 255, 0.2);
  &:hover {
    background: rgba(244, 67, 54, 0.8) !important;
  }
}
.zoom_label {
  color: #ffffff;
  font-size: 12px;
  min-width: 44px;
  text-align: center;
  letter-spacing: 0.5px;
}
.lightbox_stage {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  -webkit-overflow-scrolling: touch;
}
.lightbox_img_wrap {
  max-width: 1200px;
  transition: width 0.25s ease;
  display: flex;
  justify-content: center;
}
.lightbox_img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

@media (max-width: 600px) {
  .invite_section {
    padding: 40px 12px 60px;
  }
  .card_overlay_badge {
    font-size: 11px;
    padding: 4px 10px;
    bottom: 8px;
    right: 8px;
  }
  .lightbox_topbar {
    padding: 8px 12px;
  }
  .lightbox_eyebrow {
    font-size: 16px;
  }
  .lightbox_couple {
    font-size: 13px;
  }
  .tool_btn {
    width: 30px;
    height: 30px;
  }
}
</style>

<style>
.invitation_lightbox_dialog {
  box-shadow: none;
  overflow: hidden;
}
</style>
