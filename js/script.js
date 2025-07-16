"use strict";

// Barcha mobil menyu logikasini bitta funksiya ichiga olamiz.
// Bu kodni tartibli saqlaydi va boshqa skriptlar bilan konfliktni oldini oladi.
function initMobileMenu() {
    // === 1. Elementlarni topish ===
    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".site-nav");

    // Agar sahifada menyu elementlari bo'lmasa, funksiyani to'xtatamiz.
    if (!menuToggle || !siteNav) {
        return;
    }

    const closeMenuBtn = document.querySelector(".close-menu-btn");
    const menuOverlay = document.querySelector(".menu-overlay");
    const body = document.body;

    // Menyu ichidagi fokus qilinadigan barcha elementlarni topamiz
    const focusableElements = siteNav.querySelectorAll(
        "a[href]:not([disabled]), button:not([disabled])"
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

    // === 2. Asosiy Funksiyalar ===
    const openMenu = function () {
        body.classList.add("menu-is-open");
        menuToggle.setAttribute("aria-expanded", "true");
        body.style.overflow = "hidden";

        // Animatsiya tugaganidan so'nggina fokusni menyuga o'tkazamiz
        // Bu "setTimeout"dan ancha ishonchli usul.
        siteNav.addEventListener("transitionend", setInitialFocus, {
            once: true,
        });

        // Hodisa tinglovchilarni qo'shamiz
        document.addEventListener("keydown", handleTrapFocus);
    };

    const closeMenu = function () {
        body.classList.remove("menu-is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        body.style.overflow = "";
        menuToggle.focus(); // Fokusni menyuni ochgan tugmaga qaytaramiz

        // Hodisa tinglovchilarni olib tashlaymiz
        document.removeEventListener("keydown", handleTrapFocus);
    };

    const setInitialFocus = function () {
        firstFocusableElement.focus();
    };

    // === 3. Fokusni Qamrab Olish (Focus Trap) Logikasi ===
    const handleTrapFocus = function (e) {
        // Faqat 'Tab' klavishi bosilishini tekshiramiz
        if (e.key !== "Tab") {
            return;
        }

        // Shift + Tab bosilganda
        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                e.preventDefault();
                lastFocusableElement.focus();
            }
            // Faqat Tab bosilganda
        } else {
            if (document.activeElement === lastFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    };

    // === 4. Hodisa Tinglovchilarni (Event Listeners) O'rnatish ===
    menuToggle.addEventListener("click", openMenu);
    closeMenuBtn.addEventListener("click", closeMenu);
    menuOverlay.addEventListener("click", closeMenu);

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && body.classList.contains("menu-is-open")) {
            closeMenu();
        }
    });
}

// Sahifa to'liq yuklangach, menyu funksiyamizni ishga tushiramiz
document.addEventListener("DOMContentLoaded", initMobileMenu);
