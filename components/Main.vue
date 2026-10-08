<template>
  <div class="bg">
    <div class="text-center pt-5">
      <span class="title_text">S A V E - T H E - D A T E</span>
    </div>

    <div class="text-center mt-5">
      <span class="title_name">
        Manethong <span class="amp">&</span> Kedmany</span
      >
    </div>
    <div class="la_name_row">
      <span class="la_name"><i>ມ ະ ນີ ທ ອ ງ</i></span>
      <span class="la_name"><i>&</i></span>
      <span class="la_name"><i>ເ ກ ດ ມ ະ ນີ</i></span>
    </div>

    <div class="img_card">
      <img
        class="img_style"
        src="../static/img/main_image.webp"
        alt="main_image"
      />
    </div>

    <div class="event_info">
      <div class="event_date">ວັນອາທິດ ທີ່ 15 ເດືອນ ພະຈິກ 2026</div>
      <div class="event_place">
        <v-icon color="red" size="20">mdi-map-marker</v-icon>
        <span>At Loung Loth Restaurant</span>
      </div>
    </div>

    <div class="countdown">
      <!-- time here----------- -->
      <div class="countdown_title">ນັບຖອຍຫຼັງສູ່ວັນແຫ່ງຄວາມສຸກ</div>
      <div class="countdown_grid">
        <div
          v-for="item in countdownItems"
          :key="item.label"
          class="countdown_card"
        >
          <div class="countdown_value">{{ item.value }}</div>
          <div class="countdown_label">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ວັນແຕ່ງງານ: 15/11/2026
const WEDDING_DATE = new Date(2026, 10, 15, 0, 0, 0);

export default {
  data() {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      timer: null,
    };
  },
  computed: {
    countdownItems() {
      return [
        { label: "ວັນ", value: this.days },
        { label: "ຊົ່ວໂມງ", value: this.hours },
        { label: "ນາທີ", value: this.minutes },
        { label: "ວິນາທີ", value: this.seconds },
      ];
    },
  },
  mounted() {
    this.updateCountdown();
    this.timer = setInterval(this.updateCountdown, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    updateCountdown() {
      const diff = WEDDING_DATE.getTime() - Date.now();

      if (diff <= 0) {
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        clearInterval(this.timer);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      this.days = Math.floor(totalSeconds / 86400);
      this.hours = Math.floor((totalSeconds % 86400) / 3600);
      this.minutes = Math.floor((totalSeconds % 3600) / 60);
      this.seconds = totalSeconds % 60;
    },
  },
};
</script>

<style lang="scss" scoped>
$gold: #c8a562;
$ink: #2d3748;
$muted: #8c8275;

.bg {
  min-height: 750px;
  background-color: #faf7f2;
  padding: 0 16px 40px;
  overflow-x: hidden;
}

.title_text {
  color: $gold;
  border-top: 1px solid $gold;
  border-bottom: 1px solid $gold;
  display: inline-block;
  font-size: clamp(11px, 3.2vw, 16px);
  letter-spacing: 0.5px;
}

.title_name {
  color: $ink;
  font-family: "Great Vibes", cursive !important;
  font-size: clamp(34px, 9vw, 55px);
  line-height: 1.25;

  .amp {
    color: $gold;
    font-family: "Great Vibes", cursive !important;
  }
}

.la_name_row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: clamp(8px, 4vw, 40px);
  margin-top: -10px;
}
.la_name {
  color: $ink;
  font-size: clamp(15px, 4.5vw, 25px);
}

.img_card {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.img_style {
  width: 100%;
  max-width: 550px;
  height: auto;
  border-radius: 20px;
  display: block;
}

.event_info {
  margin-top: 15px;
  text-align: center;
}
.event_date {
  font-weight: 700;
  font-size: clamp(17px, 5vw, 25px);
  line-height: 1.4;
}
.event_place {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: clamp(13px, 3.8vw, 16px);
  margin-top: 2px;
}

.countdown {
  margin-top: 28px;
}
.countdown_title {
  text-align: center;
  color: $muted;
  font-size: clamp(13px, 4vw, 16px);
  letter-spacing: 1px;
  margin-bottom: 14px;
}
.countdown_grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(8px, 2.5vw, 16px);
}
.countdown_card {
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(200, 165, 98, 0.18);
  width: clamp(66px, 20vw, 92px);
  padding: clamp(10px, 2.5vw, 14px) 0 clamp(8px, 2vw, 10px);
  text-align: center;
}
.countdown_value {
  color: $gold;
  font-size: clamp(24px, 7vw, 34px);
  font-weight: 700;
  line-height: 1.1;
}
.countdown_label {
  color: $muted;
  font-size: clamp(12px, 3.2vw, 14px);
  margin-top: 2px;
}

@media (max-width: 600px) {
  .bg {
    min-height: auto;
    padding-bottom: 48px;
  }
}
</style>
