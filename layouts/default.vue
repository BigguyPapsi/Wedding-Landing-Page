<template>
  <v-app dark>
    <div class="nav">
      <div class="navIcon">M&K</div>

      <!-- ເມນູເຕັມ (ຈໍໃຫຍ່) -->
      <div class="nav_links d-none d-md-flex">
        <template v-for="item in items">
          <nuxt-link
            v-if="item.to"
            :key="item.title + '-link'"
            class="navText"
            :class="{ 'navText--active': isActive(item) }"
            :to="item.to"
            active-class=""
            exact-active-class=""
            @click.native="onNavClick(item)"
          >
            <b>{{ item.title }}</b>
          </nuxt-link>
          <!-- ເມນູທີ່ຍັງບໍ່ທັນມີ section -->
          <span v-else :key="item.title + '-soon'" class="navText navText--soon">
            <b>{{ item.title }}</b>
          </span>
        </template>
      </div>

      <!-- ປຸ່ມເມນູ (ຈໍນ້ອຍ) -->
      <v-btn
        icon
        class="d-md-none nav_toggle"
        aria-label="ເປີດເມນູ"
        @click="rightDrawer = true"
      >
        <v-icon color="#2D3748">mdi-menu</v-icon>
      </v-btn>
    </div>

    <v-main>
      <div>
        <Nuxt />
      </div>
    </v-main>

    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <div class="drawer_head">M&K</div>
      <v-list nav dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.to || undefined"
          active-class=""
          :class="{ 'drawer_row--active': isActive(item) }"
          @click="onNavClick(item)"
        >
          <v-list-item-title
            class="drawer_item"
            :class="{ 'drawer_item--active': isActive(item) }"
            >{{ item.title }}</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
// ຕ້ອງຕົງກັບ scroll-padding-top ໃນ assets/css/style.css
const NAV_OFFSET = 90;

export default {
  name: "DefaultLayout",
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          title: "ໜ້າຫຼັກ",
          to: "/",
        },

        {
          title: "ບັດເຊີນ & ຮູບພາບ",
          to: "/#envelope",
        },
                {
          title: "ກຳນົດການ",
          to: "/#schedule",
        },
        {
          title: "ອາລະບ້ຳພາບ",
          to: "",
        },
        {
          title: "ອວຍພອນ",
          to: "",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
      activeHash: "",
      scrollTicking: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("scroll", this.onScroll, { passive: true });
      window.addEventListener("resize", this.onScroll, { passive: true });
      this.updateActiveHash();
    });
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onScroll);
  },
  methods: {
    hashOf(item) {
      if (!item.to) return null;
      const hashIndex = item.to.indexOf("#");
      return hashIndex === -1 ? "" : item.to.slice(hashIndex);
    },
    isActive(item) {
      const hash = this.hashOf(item);
      return hash !== null && hash === this.activeHash;
    },
    // ຫຼຸດການຄຳນວນ: ອັບເດດແຕ່ລະ frame ເທົ່ານັ້ນ
    onScroll() {
      if (this.scrollTicking) return;
      this.scrollTicking = true;
      window.requestAnimationFrame(() => {
        this.updateActiveHash();
        this.scrollTicking = false;
      });
    },
    // ຫາ section ທີ່ກຳລັງຢູ່ໃນຈໍ ແລ້ວໝາຍເມນູນັ້ນເປັນ active
    updateActiveHash() {
      const sections = this.items
        .map((item) => this.hashOf(item))
        .filter((hash) => hash)
        .map((hash) => ({ hash, el: document.querySelector(hash) }))
        .filter((section) => section.el);

      if (!sections.length) {
        this.activeHash = "";
        return;
      }

      const scrollY = window.scrollY;
      const line = scrollY + NAV_OFFSET;

      // ເລື່ອນຮອດທ້າຍໜ້າແລ້ວ -> ໝາຍ section ສຸດທ້າຍ
      const atBottom =
        window.innerHeight + scrollY >= document.body.scrollHeight - 2;
      if (atBottom) {
        this.activeHash = sections[sections.length - 1].hash;
        return;
      }

      let current = "";
      sections.forEach((section) => {
        const top = section.el.getBoundingClientRect().top + scrollY;
        if (top <= line) current = section.hash;
      });

      this.activeHash = current;
    },
    // ເລື່ອນໄປຫາ section ຕາມ hash, ຖ້າບໍ່ມີ hash ໃຫ້ກັບຂຶ້ນເທິງສຸດ
    onNavClick(item) {
      // Vuetify ລັອກການເລື່ອນຕອນ drawer ເປີດຢູ່ ຈຶ່ງຕ້ອງປິດກ່ອນແລ້ວຄ່ອຍເລື່ອນ
      const delay = this.rightDrawer ? 300 : 0;
      this.rightDrawer = false;

      // ເມນູທີ່ຍັງບໍ່ທັນມີ section -> ພຽງແຕ່ປິດ drawer
      if (!item.to) return;

      const hashIndex = item.to.indexOf("#");
      const hash = hashIndex === -1 ? "" : item.to.slice(hashIndex);

      setTimeout(() => {
        if (!hash) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, delay);
    },
  },
};
</script>
<style scoped>
.nav {
  background-color: #fff;

  padding: 8px clamp(12px, 3vw, 20px);
  display: flex;
  align-items: center;

  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 8px rgba(45, 55, 72, 0.08);
}
.nav_links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(12px, 2vw, 24px);
}
.navText {
  text-decoration: none;
  color: #2d3748;
  white-space: nowrap;
  font-size: clamp(13px, 1.3vw, 15px);
  position: relative;
  padding-bottom: 4px;
  transition: color 0.2s ease;
}
.navIcon {
  color: #c8a562;
  font-family: "Great Vibes", cursive !important;
  font-size: clamp(28px, 7vw, 35px);
  line-height: 1.2;
  margin-right: clamp(14px, 3vw, 30px);
  font-weight: 700;
}
.navText--soon {
  opacity: 0.45;
  cursor: default;
}
.navText--active {
  color: #c8a562;
}
.navText--active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background-color: #c8a562;
}

.drawer_item--active {
  color: #c8a562 !important;
  font-weight: 700;
}
.drawer_row--active {
  background-color: rgba(200, 165, 98, 0.12);
}
.nav_toggle {
  margin-left: auto;
}

.drawer_head {
  color: #c8a562;
  font-family: "Great Vibes", cursive !important;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  padding: 14px 16px 6px;
  border-bottom: 1px solid #f0ece4;
}
.drawer_item {
  color: #2d3748;
  font-size: 15px;
}
</style>
