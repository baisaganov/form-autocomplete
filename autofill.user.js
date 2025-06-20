// ==UserScript==
// @name         Автозаполнение полей 1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Заполнение форм по Ctrl+Shift+F и через меню
// @match        *://*/*
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function autoFill() {
        document.querySelectorAll('input, textarea, select').forEach(el => {
            const tag = el.tagName.toLowerCase();
            const type = (el.getAttribute('type') || '').toLowerCase();
            const name = (el.getAttribute('name') || '').toLowerCase();
            const classList = el.classList;

            if (
                el.offsetParent === null ||
                type === 'hidden' ||
                type === 'file' ||
                classList.contains('file-text')
            ) return;

            if (tag === 'input' || tag === 'textarea') {
                if (tag === 'textarea' && type === 'search') return;

                if (type === 'checkbox') {
                    el.checked = Math.random() < 0.5;
                    return;
                }

                if (type === 'radio') {
                    const radios = document.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`);
                    const radioGroup = Array.from(radios).filter(r => r.offsetParent !== null && !r.disabled);
                    if (radioGroup.length) {
                        const randomRadio = radioGroup[Math.floor(Math.random() * radioGroup.length)];
                        randomRadio.checked = true;
                    }
                    return;
                }

                const randomValue = `тест_${getRandomInt(1, 10000)}`;
                if (type === 'link') {
                    el.value = 'https://example.com';
                } else if (type === 'email') {
                    el.value = `user${getRandomInt(1, 10000)}@example.com`;
                } else if (type === 'phone' || type==='work_phone') {
                    el.value = '1234567890';
                } else if (type === 'number') {
                    el.value = '16';
                } else if ((type === 'text' || !type) && name === 'number') {
                    el.value = '123456';
                } else if (type === 'text' || !type || tag === 'textarea') {
                    el.value = randomValue;
                }
            }

            if (tag === 'select') {
                const options = [...el.options].filter(opt => !opt.disabled && !opt.hidden);
                if (options.length > 0) {
                    const randomOption = options[Math.floor(Math.random() * options.length)];
                    el.value = randomOption.value;
                }
            }
        });
    }

    // Горячая клавиша: Ctrl+Shift+F
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
            autoFill();
        }
    });

    GM_registerMenuCommand("🔄 Заполнить форму", autoFill);
})();

