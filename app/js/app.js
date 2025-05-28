import intlTelInput from "intl-tel-input";
import { ru } from "intl-tel-input/i18n";

document.addEventListener("DOMContentLoaded", () => {
  initializeAnchorHandler();
  initializeDatePicker();
  initializeTransactionList();
  initialPhoneMask()
  initialCustomAccordion()
  initializeModalHandler()
  initialTabs()
  initialTransferSelect()
});

function initialPhoneMask () {
let iti;

if (iti) return

const phoneInputs = document.querySelectorAll(".phone-input");

phoneInputs.forEach((phoneInput) => {
  iti = intlTelInput(phoneInput, {
    initialCountry: "kz",
    strictMode: true,
    loadUtils: () => import("intl-tel-input/utils"),
    // geoIpLookup: function (callback) {
    //   fetch("https://ipapi.co/json/")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       callback(data.country_code);
    //     })
    //     .catch(() => callback("KZ"));
    // },
    allowDropdown: true,
    autoHideDialCode: false,
    dropdownContainer: document.body,
    preferredCountries: ["kz", "ru"],
    i18n: ru,
  });
  window.iti = iti;
  let masked;

  function updateMask() {
    const selectedCountry = iti.getSelectedCountryData();

    const countryMask = getMaskForCountry(selectedCountry.iso2);
    if (countryMask) {
      if (masked) {
        masked.destroy();
      }
      masked = IMask(phoneInput, {
        mask: countryMask,
        lazy: false,
      });
    }
  }

  function getMaskForCountry(countryCode) {
    const countryMasks = {
      kz: "+{7} (000) 000-00-00",
      ru: "+{7} (000) 000-00-00",
      us: "+{1} (000) 000-0000",
      gb: "+{44} 0000 000 000",
      fr: "+{33} 0 00 00 00 00",
      de: "+{49} 000 000000",
    };
    return countryMasks[countryCode] || "+{000} 000-000-0000";
  }

   phoneInput.addEventListener("countrychange", () => {
      updateMask();
      phoneInput.value = iti.getNumber();
    });
    // phoneInput.addEventListener("input", function () {
    //   console.log("Форматированный номер:", iti.getNumber());
    //   console.log("Валидность номера:", iti.isValidNumber());
    // });

    updateMask();
});

}

function initializeAnchorHandler() {
  function handleAnchorLink() {
    const hash = window.location.hash;
    if (!hash || (hash !== "rules" && hash !== "policy")) return;

    const targetAccordionItem = document.querySelector(hash);
    console.log(targetAccordionItem);
    if (targetAccordionItem) {
      const button = targetAccordionItem.querySelector(".accordion-button");
      const collapseElement = targetAccordionItem.querySelector(".accordion-collapse");

      if (button && collapseElement) {
        document.querySelectorAll(".accordion-collapse").forEach((collapse) => {
          const bsCollapse = new bootstrap.Collapse(collapse, { toggle: false });
          bsCollapse.hide();
        });

        const bsCollapse = new bootstrap.Collapse(collapseElement, { toggle: false });
        bsCollapse.show();

        collapseElement.addEventListener(
          "shown.bs.collapse",
          () => {
            const offsetTop = button.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({
              top: offsetTop,
              behavior: "smooth",
            });
          },
          { once: true }
        );
      }
    }
  }

  handleAnchorLink();
  window.addEventListener("hashchange", handleAnchorLink);
}

function initializeDatePicker() {
  const datepickerElement = document.getElementById("datepicker");

  if (datepickerElement) {
    const picker = flatpickr(datepickerElement, {
      dateFormat: "d.m.Y",
      locale: "ru",
      allowInput: true,
      onChange: function (selectedDates, dateStr) {
        console.log("Выбранная дата:", dateStr);
      },
    });

    document.querySelectorAll(".datepicker-show").forEach((button) => {
      button.addEventListener("click", () => {
        picker.open();
      });
    });
  }
}

function initializeTransactionList() {
  const transactionList = document.querySelector(".transaction-list");

  if (transactionList) {
    transactionList.addEventListener("click", (event) => {
      const button = event.target.closest(".btn-details");
      if (button) {
        const transactionItem = button.closest(".transaction-item");
        const details = transactionItem.querySelector(".transaction-item-details");

        if (details) {
          details.classList.toggle("expanded");

          const spanElements = button.querySelectorAll("span");
          if (details.classList.contains("expanded")) {
            spanElements[0].style.display = "none";
            spanElements[1].style.display = "inline";
          } else {
            spanElements[0].style.display = "inline";
            spanElements[1].style.display = "none";
          }
        }
      }
    });
  }
}

function initialCustomAccordion () {
     const accordions = document.querySelectorAll(".custom-accordion");

    if (!accordions.length) return;

    accordions.forEach((accordion) => {
        const header = accordion.querySelector(".custom-accordion-header");
        const content = accordion.querySelector(".custom-accordion-content");

        if (!header || !content) return;

        header.addEventListener("click", function () {
            const isActive = accordion.classList.contains("active");

            accordions.forEach((acc) => acc.classList.remove("active"));

            if (!isActive) {
                accordion.classList.add("active");
            }
        });
    });
}

function initializeModalHandler() {
    window.modalHandler = {
        open(event, modalId) {
            event.preventDefault();
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        },
        close(event = null, modalId) {
            if (event && event.preventDefault) {
                event.preventDefault();
            }
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
            }
        }
    };
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.v-modal__overlay.active').forEach(modal => modal.classList.remove('active'));
        }
    });
}

function initialTabs () {
  document.querySelectorAll(".v-tabs-container").forEach((container) => {
    const tabs = container.querySelectorAll(".v-tab-button");
    const panes = container.querySelectorAll(".v-tab-pane");
    
    if (tabs.length === 0 || panes.length === 0) {
      console.warn("No tabs or tab content found in a container.");
      return;
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetId = tab.dataset.tab;
        const targetPane = container.querySelector(`#${targetId}`);

        if (!targetPane) {
          console.error(`Tab content with ID "${targetId}" not found.`);
          return;
        }

        tabs.forEach((t) => t.classList.remove("active"));
        panes.forEach((p) => p.classList.remove("active"));

        tab.classList.add("active");
        targetPane.classList.add("active");
      });
    });
  });
}

// function initialCustomSelect () {
//   document.querySelectorAll("[data-select]").forEach(select => {
//     const trigger = select.querySelector("[data-trigger]");
//     const options = select.querySelector("[data-options]");
//     const hiddenInput = select.querySelector("[data-hidden-input]");

//     if (!trigger || !options || !hiddenInput) return;

//     trigger.addEventListener("click", () => {
//       select.classList.toggle("open");
//     });

//     options.querySelectorAll("[data-value]").forEach(option => {
//       option.addEventListener("click", () => {
//         trigger.textContent = option.textContent;
//         hiddenInput.value = option.getAttribute("data-value");
//         select.classList.remove("open");
//       });
//     });

//     document.addEventListener("click", (e) => {
//       if (!select.contains(e.target)) {
//         select.classList.remove("open");
//       }
//     });
//   });
// }
function initialTransferSelect () {
 document.querySelectorAll("[data-select]").forEach(select => {
    const trigger = select.querySelector("[data-trigger]");
    const options = select.querySelector("[data-body]");
    const hiddenInput = select.querySelector("[data-hidden-input]");

    if (!trigger || !options || !hiddenInput) return;

    trigger.addEventListener("click", () => {
      const isOpen = select.classList.toggle("open");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    options.querySelectorAll("[data-value]").forEach(option => {
      option.addEventListener("click", () => {
        trigger.innerHTML = option.innerHTML;
        hiddenInput.value = option.getAttribute("data-value");
        select.classList.remove("open");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("click", (e) => {
      if (!select.contains(e.target)) {
        select.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  });
}