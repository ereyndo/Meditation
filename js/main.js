const mainHeader = document.querySelector(".main-header");
const switchWord = document.getElementById("switch-word");
const mainNav = document.querySelector(".main-nav");
const opacityBlock = document.querySelector(".change-page-opacity");
const whatSec = document.getElementById("what");
const whySec = document.getElementById("why");
const howSec = document.getElementById("how");
const contactSec = document.getElementById("contact");
const sidenavBtn = document.querySelector(".sidenav-btn");

let clientHeight = document.documentElement.clientHeight;
let clientWidth = document.documentElement.clientWidth;

let num_of_scrolling = 0;
let flag_trans_end = false;
let flag_for_btn = false;

function goToID(event) {   // -------- correct jump to some section by clicking the navbar buttons
    try {
        let temp;
        switch (event.target.id) {
            case "what_button":
                temp = document.getElementById("what_key");
                break;
            case "why_button":
                temp = document.getElementById("why_key");
                break;
            case "how_button":
                temp = document.getElementById("how_key");
                break;
            case "contact_button":
                temp = document.getElementById("contact_key");
                break;
        }
        flag_for_btn = true;
        window.scrollTo(0, window.pageYOffset + temp.getBoundingClientRect().top - 70);
        if (clientWidth <= 880) {
            toggleSidenav();
        }
    } catch (err) {
        console.error(err);
    }
}

mainNav.addEventListener("click", goToID);

function check_the_position_for_NB() {   // -------- if the page wasn't refreshed on the beginning
    if (window.scrollY >= (1900 + window.innerHeight/5)) {
        mainHeader.classList.add("main-header-move-down");
    }
}

check_the_position_for_NB();

function changeNavBar() {   // -------- change navbar through the scrolling
    if (window.scrollY >= (1900 + window.innerHeight/5)) {
        mainHeader.classList.add("main-header-move-down");
    } else {
        mainHeader.classList.remove("main-header-move-down");
    }
}

window.addEventListener("scroll", changeNavBar);

async function switchingInvitationWords() {   // -------- switch the invitation words through the scrolling
    try {
        if (num_of_scrolling < 2) {
            if (window.scrollY >= 400 && window.scrollY <= 800 && num_of_scrolling === 0) {
                num_of_scrolling++;
                await switcher("hour");
                flag_trans_end = true;
            } else if (window.scrollY >= 800 && flag_trans_end === true) {
                num_of_scrolling = 2;
                await switcher("moment");
            } else if (window.scrollY >= 800 && num_of_scrolling === 0) {
                num_of_scrolling = 2;
                await switcher("hour");
                await switcher("moment");
            }
        }
    } catch (error) {
        console.error(error);
    }
}

async function switcher(name) {   // -------- smooth disappearance of an old word and appearance of the new one
    await toggleTheOpacity();
    switchWord.innerHTML = name;
    await toggleTheOpacity();
}

function toggleTheOpacity() {    // -------- manage the invitation words opacity
    return new Promise((resolve) => {
        const onAnimationEnd = () => {
            switchWord.removeEventListener('transitionend', onAnimationEnd);
            resolve();
        }
        switchWord.addEventListener('transitionend', onAnimationEnd);
        switchWord.classList.toggle("opacity-100");
    });
}

window.addEventListener("scroll", switchingInvitationWords);

function currentWindowParam() {   // -------- define the current window parameters
    clientHeight = document.documentElement.clientHeight;
    clientWidth = document.documentElement.clientWidth;
    opacityBlock.style.opacity = "1";
    if (clientWidth > 880) {
        mainNav.style.width = "580px";
        sidenavBtn.classList.remove("sidenav-btn_active");
    } else {
        mainNav.style.width = "0";
    }
}

window.addEventListener("resize", currentWindowParam);

function changePageOpacity() {   // -------- smooth disappearance of an old section and appearance of the new one
    if (flag_for_btn === true) {
        opacityBlock.style.opacity = "1";
        flag_for_btn = false;
        return;
    }
    let currentHeightWithOffset = clientHeight + window.pageYOffset;
    let helloStart = 1900 + 1.28 * clientHeight;
    let helloEnd = window.pageYOffset + whatSec.getBoundingClientRect().top + whatSec.querySelector(".text-of-section").offsetTop + whatSec.querySelector(".text-of-section").offsetHeight;
    let whatStart = window.pageYOffset + whatSec.getBoundingClientRect().bottom;
    let whatEnd = window.pageYOffset + whySec.getBoundingClientRect().top + whySec.querySelector(".text-of-section").offsetTop + whySec.querySelector(".text-of-section").offsetHeight + whySec.querySelector(".list").offsetHeight / 1.7;
    let whyStart = window.pageYOffset + 1.2 * whySec.getBoundingClientRect().bottom;
    let whyEnd = window.pageYOffset + howSec.getBoundingClientRect().top + howSec.querySelector(".text-of-section").offsetTop + howSec.querySelector(".text-of-section").offsetHeight + howSec.querySelector(".ordered-list").offsetHeight / 1.7;
    let howStart = window.pageYOffset + 1.5 * howSec.getBoundingClientRect().bottom;
    let howEnd = window.pageYOffset + contactSec.getBoundingClientRect().bottom - document.getElementById("contact_key").offsetHeight;
    if (currentHeightWithOffset >= helloStart && currentHeightWithOffset <= helloEnd) {
        opacityState(helloStart, helloEnd, currentHeightWithOffset);
    } else if (currentHeightWithOffset >= whatStart && currentHeightWithOffset <= whatEnd) {
        opacityState(whatStart, whatEnd, currentHeightWithOffset);
    } else if (currentHeightWithOffset >= whyStart && currentHeightWithOffset <= whyEnd) {
        opacityState(whyStart, whyEnd, currentHeightWithOffset);
    } else if (currentHeightWithOffset >= howStart && currentHeightWithOffset <= howEnd) {
        opacityState(howStart, howEnd, currentHeightWithOffset);
    } else if (opacityBlock.style.opacity !== "1") {
        opacityBlock.style.opacity = "1";
    }
}

function opacityState(start, end, cur) {   // -------- sections appearance and disappearance speed
    let dif = end - start;
    let addGap;
    if (!document.querySelector(".gap").style.height) {
        addGap = 0;
    } else {
        addGap = parseInt(document.querySelector(".gap").style.height, 10) / dif * 1000;
    }
    let unit = dif / (1000 + addGap);
    let i = 0;
    for (let temp = start; temp < cur; i++) {
        temp += unit;
    }
    if (i < 390) {
        let temp = (380 - i) / 380;
        opacityBlock.style.opacity = temp.toString();
    } else if (i < 630 + addGap) {
        opacityBlock.style.opacity = "0";
    } else {
        let temp = (i - 620 - addGap) / 380;
        opacityBlock.style.opacity = temp.toString();
    }
}

function doWeNeedChangingOpacity() {   // -------- define whether we need that smooth sections switching or not; depend on a screen resolution
    if (clientHeight / clientWidth >= 0.300) {
        window.addEventListener("scroll", changePageOpacity);
    } else {
        window.removeEventListener("scroll", changePageOpacity);
    }
}

doWeNeedChangingOpacity();

window.addEventListener("resize", doWeNeedChangingOpacity);

function addingGap() {   // -------- define whether we need an additional gap between sections for correct display;depend on a screen resolution
    if (clientHeight / clientWidth > 0.488) {
        const gapElement = document.querySelectorAll(".gap");
        gapElement.forEach(function(gapItem) {
            gapItem.style.height = `${clientHeight - clientWidth*0.488}px`;
        });
    }
}

addingGap();

window.addEventListener("resize", addingGap);

function toggleSidenav(event) {   // -------- toggle sidenav
    if (event) {
        event.preventDefault();
    }
    sidenavBtn.classList.toggle("sidenav-btn_active");
    if (sidenavBtn.classList.contains("sidenav-btn_active")) {
        mainNav.style.width = "200px";
    } else {
        mainNav.style.width = "0";
    }
}

sidenavBtn.addEventListener("click", toggleSidenav);