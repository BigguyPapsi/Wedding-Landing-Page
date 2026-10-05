<template>
  <div id="schedule">
    <div class="invite_eyebrow">Exclusive Invitation</div>
    <div class="title_text">ກຳນົດການ ແລະ ສະຖານທີ່</div>
    <div class="sub_title">ວັນອາທິດ ທີ່ 15 ເດືອນ ພະຈິກ 2026</div>
    <div class="invite_divider"></div>
    <div>
      <v-container>
        <V-row>
          <v-col cols="6">
            <v-card
              style="background-color: #faf7f2; border: 1px solid #c8a562"
            >
              <v-card-text>
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
          <v-col cols="6">
            <v-card
              style="background-color: #faf7f2; border: 1px solid #c8a562"
            >
              <v-card-text>
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
        </V-row>
        <div class="mt-5">
          <v-card style="background-color: #faf7f2; border: 1px solid #c8a562">
            <v-card-text>
              <div>
                <div>ສະຖານທີ່ຈັດງານ</div>
                <div>
                  <h2>Loung Loth Restaurant</h2>
                </div>
                <div>
                  <a
                    href="https://maps.app.goo.gl/7M7amgC3aYxsE6JU8"
                    target="_blank"
                    >
                    ເປີດແຜນທີ່
                    </a>
                </div>
              </div>
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
  font-size: 15px;
}
.title_text {
  text-align: center;
  color: $ink;
  font-size: 34px;
  font-weight: 700;
}
.invite_eyebrow {
  text-align: center;
  font-family: "Great Vibes", cursive !important;
  color: $gold;
  font-size: 32px;
  line-height: 1.2;
}
</style>
