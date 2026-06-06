/* ─── Page Routes ──────────────────────────────────────────── */
const Home         = "index.html";
const AboutMe      = "aboutme.html";
const Photography  = "photography.html";
const HomeLab      = "homelab.html";
const Portfolio    = "index.html#portfolio-items-holder";
const BucketCentral   = "comingsoon.html";
const ContentCredits  = "comingsoon.html";

/* ─── Article Routes ───────────────────────────────────────── */
const articleWebsite  = "comingsoon.html";
const articleMc       = "comingsoon.html";
const articlePandus   = "pandus.html";
const articleKauli    = "comingsoon.html";
const articleTht      = "comingsoon.html";
const articleElecf    = "comingsoon.html";
const articleSol      = "comingsoon.html";
const Brolocator      = "Brolocator.html";
const ProjJune        = "ProjectJune.html";
const Copyboard       = "comingsoon.html";
const csdp            = "csdp.html";

/* ─── External Links ───────────────────────────────────────── */
const Instagram    = "https://www.instagram.com/bombastic_demise?igsh=MTQzZWQ0ODQyZmlyMg%3D%3D&utm_source=qr";
const Youtube      = "https://www.youtube.com/@newkringster2564";
const Whatsapp     = "https://wa.me/6597100366";
const Github       = "https://github.com/New-Kringster";
const photogallery = "https://photos.chiambucket.com";

/* ─── Navigation Utility ───────────────────────────────────── */
let MenuState = false;

function navigate(url) {
    window.location = url;
}

// Named shortcuts kept for HTML onclick compatibility
function BucketCentralOnClick()      { navigate(BucketCentral); }
function PhotographyOnClick()        { navigate(Photography); }
function HomelabOnClick()            { navigate(HomeLab); }
function HomeOnClick()               { navigate(Home); }
function ContentCreditsOnClick()     { navigate(ContentCredits); }
function InstagramOnClick()          { navigate(Instagram); }
function YoutubeOnClick()            { navigate(Youtube); }
function WhatsappOnClick()           { navigate(Whatsapp); }
function GithubOnClick()             { navigate(Github); }
function PhotogalleryOnClick()       { navigate(photogallery); }
function PortfolioOnClick()          { navigate(Portfolio); }
function articleWebsiteOnClick()     { navigate(articleWebsite); }
function articlePandusOnClick()      { navigate(articlePandus); }
function articleKauliOnClick()       { navigate(articleKauli); }
function articleThtOnClick()         { navigate(articleTht); }
function articleElecfOnClick()       { navigate(articleElecf); }
function articleSolOnClick()         { navigate(articleSol); }
function articleMcOnClick()          { navigate(articleMc); }
function articleBrolocatorOnClick()  { navigate(Brolocator); }
function articlecopyboardOnClick()   { navigate(Copyboard); }
function articlecsdpOnClick()        { navigate(csdp); }
function articleProjJuneOnClick()    { navigate(ProjJune); }

/* ─── Mobile Menu ──────────────────────────────────────────── */
function MenuBar() {
    MenuState = !MenuState;
    if (MenuState) {
        $('#nav').removeClass('nav-closed').addClass('nav-open');
        $('#navitem').removeClass('navitem').addClass('navitem-open');
        $('.Nav-Menu-Items').removeClass('Nav-Menu-Items').addClass('Nav-Menu-Items-Open');
    } else {
        $('#nav').removeClass('nav-open').addClass('nav-closed');
        $('#navitem').removeClass('navitem-open').addClass('navitem');
        $('.Nav-Menu-Items-Open').removeClass('Nav-Menu-Items-Open').addClass('Nav-Menu-Items');
    }
}

/* ─── Photo Album Expand ───────────────────────────────────── */
function expandphoto() {
    $('#lyc').removeClass('lyc');
    $('#expand').addClass('loader-hide');
}

function expandPhoto(albumId) {
    $('#photography-' + albumId).removeClass('photography-restrict');
    $('#expand-' + albumId).addClass('loader-hide');
}

/* ─── Portfolio Card Toggles ───────────────────────────────── */
function toggleCard(contentId, menuId) {
    $('#' + contentId).toggleClass('pf-hidden-content-shown');
    $('#' + menuId).toggleClass('portfolio-items2-open');
}

/* ─── Portfolio Hero Scroll & Visibility ───────────────────── */
function Hideherobg() {
    $('#portfolio-hero-bg').addClass('hidden');
}

function Wakebg() {
    $('#portfolio-items-holder').addClass('portfolio-items-holder-show');
}

let firstcall = true;
const bottomElement = document.querySelector('.detect-reach');

const observer = new IntersectionObserver((entries) => {
    if (!firstcall) {
        setTimeout(Wakebg, 1);
        setTimeout(Hideherobg, 200);
    }
    firstcall = false;
});

try {
    observer.observe(bottomElement);
} catch (error) {
    // .detect-reach not present on this page
}

function scrolll() {
    var left = document.querySelector(".portfolio-hero-bottom");
    $('#left-arrow-hidden').addClass('portfolio-items-holder-show');
    left.scrollBy(500, 0);
}

function scrollr() {
    var right = document.querySelector(".portfolio-hero-bottom");
    right.scrollBy(-500, 0);
}

/* ─── Shared Components ────────────────────────────────────── */
$(function () {
    $("#nav-holder").load("nav.html");
    $("#footers").load("footer.html");
});

$(window).on("load", function () {
    $("#loader").fadeOut();
});

/* ─── Article Scroll-Spy ───────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
    const sections  = document.querySelectorAll("section");
    const navLinks  = document.querySelectorAll(".article-chapter-wrapper a");

    const chapterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navLinks.forEach((link) => link.classList.remove("article-chapter-selected"));

                    const activeLink = document.querySelector(
                        `.article-chapter-wrapper a[href="#${entry.target.id}"]`
                    );
                    if (activeLink) {
                        activeLink.classList.add("article-chapter-selected");
                    }
                }
            });
        },
        { threshold: 0.15 }
    );

    sections.forEach((section) => chapterObserver.observe(section));
});
