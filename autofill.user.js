// ==UserScript==
// @name         Автозаполнение полей 1.5.1
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Заполнение форм по Ctrl+Shift+F и через меню
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @updateURL    https://baisaganov.github.io/form-autocomplete/autofill.user.js
// @downloadURL  https://baisaganov.github.io/form-autocomplete/autofill.user.js
// @author       Alisher Baisaganov
// ==/UserScript==

(function () {
    'use strict';

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function handleRadioGroups() {
        const processedNames = new Set();

        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            const name = radio.getAttribute('name');
            if (!name || processedNames.has(name)) return;

            const group = document.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`);
            const visibleGroup = Array.from(group).filter(r => r.offsetParent !== null && !r.disabled);
            if (visibleGroup.length > 0) {
                const randomRadio = visibleGroup[Math.floor(Math.random() * visibleGroup.length)];
                randomRadio.checked = true;
                randomRadio.dispatchEvent(new Event('change', { bubbles: true }));
            }

            processedNames.add(name);
        });
    }

    function autoFill() {
        // свитчер
        document.querySelectorAll('label.toggle-label').forEach(label => {
            label.click();
        });

        document.querySelectorAll('input, textarea, select').forEach(el => {
            const tag = el.tagName.toLowerCase();
            const type = (el.getAttribute('type') || '').toLowerCase();
            const name = (el.getAttribute('name') || '').toLowerCase();
            const classList = el.classList;

            if (
                el.offsetParent === null ||
                type === 'hidden' ||
                type === 'file' ||
                classList.contains('file-text') ||
                el.readOnly ||
                el.disabled ||
                classList.contains('datepicker-here') ||
                classList.contains('defence_year') ||
                el.id === 'code' ||
                classList.contains('datepicker-max')
            ) return;

            if (tag === 'input' || tag === 'textarea') {
                if (tag === 'textarea' && type === 'search') return;

                if (type === 'checkbox') {
                    if (el.offsetParent === null || getComputedStyle(el).display === 'none') {
                        const label = document.querySelector(`label[for="${el.id}"]`);
                        if (label) label.click();
                    } else {
                        el.checked = true;
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    return;
                }

                const randomValue = `тест_${getRandomInt(1, 10000)}`;
                if (type === 'link' ||
                    name === 'website' ||
                    name === 'linkedin_url' ||
                    name === 'facebook_url' ||
                    name === 'instagram_url' ||
                    name === 'gis_url') {
                    el.value = `test${getRandomInt(1, 10000)}.kz`;
                } else if (type === 'email' || name === 'email') {
                    el.value = `user${getRandomInt(1, 10000)}@test.kz`;
                } else if (type === 'phone' || type === 'work_phone' || name === 'phone' || name === 'city_phone') {
                    el.value = '1234567890';
                } else if (type === 'number') {
                    el.value = getRandomInt(1, 10000);
                } else if ((type === 'text' || !type)
                    && (name === 'number' ||
                        name === 'work_experience_years' ||
                        name === 'work_experience_months')) {
                    el.value = getRandomInt(10000, 1000000);
                } else if (type === 'text' || !type || tag === 'textarea') {
                    el.value = randomValue;
                }
            }

            if (tag === 'select' && !el.classList.contains('tagDetect')) {
                const options = [...el.options].filter(opt => !opt.disabled && !opt.hidden);
                const validOptions = options.filter(opt => opt.value.trim() !== '');

                if (validOptions.length > 0) {
                    const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
                    el.value = randomOption.value;
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });

        handleRadioGroups();
    }

    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
            autoFill();
        }
    });

    GM_registerMenuCommand("🔄 Заполнить форму", autoFill);
})();
