<template>
  <div id="schedule">
    <div class="invite_eyebrow">Exclusive Invitation</div>
    <div class="title_text">ກຳນົດການ ແລະ ສະຖານທີ່</div>
    <div class="sub_title">ວັນອາທິດ ທີ່ 15 ເດືອນ ພະຈິກ 2026</div>
    <div class="invite_divider"></div>
    <div>
      <v-container class="schedule_container">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card
              style="background-color: #faf7f2; border: 1px solid #c8a562"
            >
              <v-card-text class="pa-4 pa-sm-6">
                <div style="display: flex; justify-content: center">
                  <div class="icon_style mb-5">
                    <v-icon size="45" color="#c8a562">mdi-ring</v-icon>
                  </div>
                </div>
                <div style="display: flex; justify-content: center">
                  <span style="color: #c8a562">ຕອນສວາຍ</span>
                </div>
                <div style="text-align: center">
                  <h2 style="color: #2d3748" class="my-2">ເຮັດຂວັນ, ມັດແຂນ</h2>
                </div>
                <div style="display: flex; justify-content: center">
                  <span
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                    ><v-icon color="#c8a562" size="17"
                      >mdi-clock-time-three-outline</v-icon
                    ></span
                  >

                  <span>11:00 ໂມງ - 17:00 ໂມງ</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card
              style="background-color: #faf7f2; border: 1px solid #c8a562"
            >
              <v-card-text class="pa-4 pa-sm-6">
                <div style="display: flex; justify-content: center">
                  <div class="icon_style mb-5">
                    <v-icon size="45" color="#c8a562">mdi-glass-wine</v-icon>
                  </div>
                </div>
                <div style="display: flex; justify-content: center">
                  <span style="color: #c8a562">ຕອນແລງ</span>
                </div>
                <div style="text-align: center">
                  <h2 style="color: #2d3748" class="my-2">
                    ສັງສັນ, ກິນເຂົ້າແລງ
                  </h2>
                </div>
                <div style="display: flex; justify-content: center">
                  <span
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                    ><v-icon color="#c8a562" size="17"
                      >mdi-clock-time-three-outline</v-icon
                    ></span
                  >

                  <span>18:00 ໂມງ ເປັນຕົ້ນໄປ</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div class="mt-5">
          <v-card style="background-color: #faf7f2; border: 1px solid #c8a562">
            <v-card-text class="pa-4 pa-sm-6">
              <v-row align="center">
                <v-col cols="12" md="6" class="venue_info text-center text-md-left">
                  <div class="venue_eyebrow">ສະຖານທີ່ຈັດງານ</div>
                  <h2 class="venue_name">Loung Loth Restaurant</h2>
                  <v-btn
                    class="mt-4 map_btn"
                    :block="$vuetify.breakpoint.xsOnly"
                    color="#c8a562"
                    dark
                    depressed
                    rounded
                    href="https://maps.app.goo.gl/7M7amgC3aYxsE6JU8"
                    target="_blank"
                    rel="noopener"
                  >
                    <v-icon left size="18">mdi-map-marker</v-icon>
                    ນຳທາງດ້ວຍ Google Maps
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="map_frame">
                    <iframe
                      src="https://maps.google.com/maps?q=17.9518821,102.6366229&amp;z=17&amp;hl=lo&amp;output=embed"
                      title="Loung Loth Restaurant"
                      loading="lazy"
                      allowfullscreen
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
$gold: #c8a562;
$ink: #2d3748;

/* breakpoints aligned with Vuetify 2: xs < 600, sm < 960, md < 1264 */

.icon_style {
  border: 1px solid #c8a562;
  background-color: #fff;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.invite_divider {
  width: 70px;
  height: 2px;
  background-color: $gold;
  margin: 12px auto 0;
}
.sub_title {
  text-align: center;
  color: #8c8275;
  font-size: clamp(13px, 3.4vw, 15px);
  padding: 0 16px;
}
.title_text {
  text-align: center;
  color: $ink;
  font-size: clamp(22px, 6vw, 34px);
  font-weight: 700;
  line-height: 1.25;
  padding: 0 16px;
}
.invite_eyebrow {
  text-align: center;
  font-family: "Great Vibes", cursive !important;
  color: $gold;
  font-size: clamp(24px, 7vw, 32px);
  line-height: 1.2;
}
.venue_eyebrow {
  color: $gold;
  font-size: clamp(13px, 3.2vw, 14px);
  letter-spacing: 0.5px;
}
.venue_name {
  color: $ink;
  font-size: clamp(20px, 5vw, 28px);
  font-weight: 700;
  line-height: 1.3;
  margin-top: 4px;
  word-break: break-word;
}
.map_btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
}
.map_frame {
  width: 100%;
  height: 260px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid $gold;
  box-shadow: 0 4px 14px rgba(45, 55, 72, 0.12);

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }
}

/* tablet */
@media (max-width: 960px) {
  .map_frame {
    height: 240px;
  }
  .venue_info {
    margin-bottom: 4px;
  }
}

/* phone */
@media (max-width: 600px) {
  .schedule_container {
    padding-left: 8px;
    padding-right: 8px;
  }
  .icon_style {
    width: 56px;
    height: 56px;

    .v-icon {
      font-size: 32px !important;
    }
  }
  .map_frame {
    height: 200px;
    border-radius: 10px;
  }
  .map_btn {
    font-size: 13px;
  }
}
</style>
