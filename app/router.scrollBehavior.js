// ແທນທີ່ scrollBehavior ມາດຕະຖານຂອງ Nuxt ທີ່ກະໂດດໄປທັນທີ
// ໃຫ້ເລື່ອນແບບນຸ້ມນວນ (smooth) ແທນ

// ລໍຖ້າ element ປາກົດ (ຈຳເປັນຕອນເປີດລິ້ງທີ່ມີ hash ໂດຍກົງ ເພາະ ssr: false)
function waitForElement(selector, retries = 20) {
  return new Promise((resolve) => {
    const check = (left) => {
      const el = document.querySelector(selector);
      if (el || left <= 0) {
        resolve(el);
        return;
      }
      setTimeout(() => check(left - 1), 50);
    };
    check(retries);
  });
}

export default async function (to, from, savedPosition) {
  // ກົດປຸ່ມ back/forward ຂອງ browser -> ກັບໄປຕຳແໜ່ງເດີມ
  if (savedPosition) {
    return savedPosition;
  }

  if (to.hash) {
    const target = await waitForElement(to.hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return false;
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  return false;
}
