src="https://code.jquery.com/jquery-3.7.1.min.js";
integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=";
crossorigin="anonymous";
let Home = "index.html";
let AboutMe = "aboutme.html";
let Photography = "photography.html";
let HomeLab = "homelab.html";
let Portfolio = "index.html#portfolio-items-holder";
let BucketCentral = "comingsoon.html";
let ContentCredits = "comingsoon.html"

/* Article Links*/
let aritcleWebsite = "comingsoon.html"
let aritcleMc = "comingsoon.html"
let aritclePandus = "pandus.html"
let aritcleKauli = "comingsoon.html"
let aritcleTht = "comingsoon.html"
let aritcleElecf = "comingsoon.html"
let aritcleSol = "comingsoon.html"
let Brolocator = "Brolocator.html"
let Copyboard = "comingsoon.html"
let csdp = "csdp.html"

/* External social links */
let Instagram = "https://www.instagram.com/bombastic_demise?igsh=MTQzZWQ0ODQyZmlyMg%3D%3D&utm_source=qr"
let Youtube = "https://www.youtube.com/@newkringster2564"
let Whatsapp = "https://wa.me/6597100366"

/* Bucket hosted links */
let photogallery = "https://photos.chiambucket.com"
let MenuState = false;

function BucketCentralOnClick() {
    window.location = BucketCentral;
}

function PhotographyOnClick() {
    window.location = Photography;
}

function HomelabOnClick() {
    window.location = HomeLab
}

function HomeOnClick() {
    window.location = Home;
}

function ContentCreditsOnClick() {
    window.location = ContentCredits;
}

function InstagramOnClick() {
    window.location = Instagram;
}

function YoutubeOnClick() {
    window.location = Youtube;
}

function WhatsappOnClick() {
    window.location = Whatsapp;
}

function PhotogalleryOnClick() {
    window.location = photogallery;
}

function PortfolioOnClick() {
    window.location = Portfolio;
}
function articleWebsiteOnClick() {
    window.location = aritcleWebsite;
}
function articlePandusOnClick() {
    window.location = aritclePandus;
}
function articleKauliOnClick() {
    window.location = aritcleKauli;
}
function articleThtOnClick() {
    window.location = aritcleTht;
}
function articleElecfOnClick() {
    window.location = aritcleElecf;
}
function articleElecfOnClick() {
    window.location = aritcleElecf;
}
function articleSolOnClick() {
    window.location = aritcleSol;
}
function articleMcOnClick() {
    window.location = aritcleMc;
}
function articleBrolocatorOnClick() {
    window.location = Brolocator;
}
function articlecopyboardOnClick() {
    window.location = Copyboard;
}
function articlecsdpOnClick() {
    window.location = csdp;
}
$(window).on("load",function(){
    $("#loader").fadeOut()
});
function MenuBar() {
    if (MenuState == false) {
        MenuState = true
        console.log("MenuState is now true (open)")
        $('#nav').removeClass('nav-closed').addClass('nav-open');
        $('#navitem').removeClass('navitem').addClass('navitem-open');
        $('#Nav-Item-1').removeClass('Nav-Menu-Items').addClass('Nav-Menu-Items-Open');
        $('#Nav-Item-2').removeClass('Nav-Menu-Items').addClass('Nav-Menu-Items-Open');
        $('#Nav-Item-3').removeClass('Nav-Menu-Items').addClass('Nav-Menu-Items-Open');
        $('#Nav-Item-4').removeClass('Nav-Menu-Items').addClass('Nav-Menu-Items-Open');
        $('#Nav-Item-5').removeClass('Nav-Menu-Items').addClass('Nav-Menu-Items-Open');
    } 
    else {
        MenuState = false;
        console.log("MenuState is now false (closed)");
        $('#nav').removeClass('nav-open').addClass('nav-closed');
        $('#navitem').removeClass('navitem-open').addClass('navitem');
        $('#Nav-Item-1').removeClass('Nav-Menu-Items-Open').addClass('Nav-Menu-Items');
        $('#Nav-Item-2').removeClass('Nav-Menu-Items-Open').addClass('Nav-Menu-Items');
        $('#Nav-Item-3').removeClass('Nav-Menu-Items-Open').addClass('Nav-Menu-Items');
        $('#Nav-Item-4').removeClass('Nav-Menu-Items-Open').addClass('Nav-Menu-Items');
        $('#Nav-Item-5').removeClass('Nav-Menu-Items-Open').addClass('Nav-Menu-Items');
    }
}

function expandphoto() {
    $('#lyc').removeClass('lyc')
    $('#expand').addClass('loader-hide');
}

function expandphoto_highlight() {
    $('#photography-highlight').removeClass('photography-restrict')
    $('#expand-highlight').addClass('loader-hide');
}

function expandphoto_europe() {
    $('#photography-europe').removeClass('photography-restrict')
    $('#expand-europe').addClass('loader-hide');
}
function expandphoto_21by9() {
    $('#photography-21by9').removeClass('photography-restrict')
    $('#expand-21by9').addClass('loader-hide');
}

function expandphoto_china() {
    $('#photography-china').removeClass('photography-restrict')
    $('#expand-china').addClass('loader-hide');
}

function expandphoto_general() {
    $('#photography-general').removeClass('photography-restrict')
    $('#expand-general').addClass('loader-hide');
}

function expandphoto_zealand() {
    $('#photography-zealand').removeClass('photography-restrict')
    $('#expand-zealand').addClass('loader-hide');
}

let BlDd = false;
function blddf() {
    if (BlDd == false) {
        BlDd = true
        $('#bldd').addClass('pf-hidden-content-shown');
        $('#blddm').addClass('portfolio-items2-open');
    } 
    else {
        BlDd = false;
        $('#bldd').removeClass('pf-hidden-content-shown');
        $('#blddm').removeClass('portfolio-items2-open');
    }
}
let PdDd = false;
function pdddf() {
    if (PdDd == false) {
        PdDd = true
        $('#pddd').addClass('pf-hidden-content-shown');
        $('#pdddm').addClass('portfolio-items2-open');
    } 
    else {
        PdDd = false;
        $('#pddd').removeClass('pf-hidden-content-shown');
        $('#pdddm').removeClass('portfolio-items2-open');
    }
}
let EmDd = false;
function emddf() {
    if (EmDd == false) {
        EmDd = true
        $('#emdd').addClass('pf-hidden-content-shown');
        $('#emddm').addClass('portfolio-items2-open');
    } 
    else {
        EmDd = false;
        $('#emdd').removeClass('pf-hidden-content-shown');
        $('#emddm').removeClass('portfolio-items2-open');
    }
}
let KlDd = false;
function klddf() {
    if (KlDd == false) {
        KlDd = true
        $('#kldd').addClass('pf-hidden-content-shown');
        $('#klddm').addClass('portfolio-items2-open');
    } 
    else {
        KlDd = false;
        $('#kldd').removeClass('pf-hidden-content-shown');
        $('#klddm').removeClass('portfolio-items2-open');
    }
}
let SlDd = false;
function slddf() {
    if (SlDd == false) {
        SlDd = true
        $('#sldd').addClass('pf-hidden-content-shown');
        $('#slddm').addClass('portfolio-items2-open');
    } 
    else {
        SlDd = false;
        $('#sldd').removeClass('pf-hidden-content-shown');
        $('#slddm').removeClass('portfolio-items2-open');
    }
}
let CpDd = false;
function cpddf() {
    if (CpDd == false) {
        CpDd = true
        $('#cpdd').addClass('pf-hidden-content-shown');
        $('#cpddm').addClass('portfolio-items2-open');
    } 
    else {
        CpDd = false;
        $('#cpdd').removeClass('pf-hidden-content-shown');
        $('#cpddm').removeClass('portfolio-items2-open');
    }
}
let EfDd = false;
function efddf() {
    if (EfDd == false) {
        EfDd = true
        $('#efdd').addClass('pf-hidden-content-shown');
        $('#efddm').addClass('portfolio-items2-open');
    } 
    else {
        EfDd = false;
        $('#efdd').removeClass('pf-hidden-content-shown');
        $('#efddm').removeClass('portfolio-items2-open');
    }
}
let ThDd = false;
function thddf() {
    if (ThDd == false) {
        ThDd = true
        $('#thdd').addClass('pf-hidden-content-shown');
        $('#thddm').addClass('portfolio-items2-open');
    } 
    else {
        ThDd = false;
        $('#thdd').removeClass('pf-hidden-content-shown');
        $('#thddm').removeClass('portfolio-items2-open');
    }
}
let McDd = false;
function mcddf() {
    if (McDd == false) {
        McDd = true
        $('#mcdd').addClass('pf-hidden-content-shown');
        $('#mcddm').addClass('portfolio-items2-open');
    } 
    else {
        McDd = false;
        $('#mcdd').removeClass('pf-hidden-content-shown');
        $('#mcddm').removeClass('portfolio-items2-open');
    }
}


function Hideherobg() {
    $('#portfolio-hero-bg').addClass('hidden');
}
function Wakebg() {
    $('#portfolio-items-holder').addClass('portfolio-items-holder-show');
}
let firstcall = true
const bottomElement = document.querySelector('.detect-reach');
const tohideelement = document.querySelector('.portfolio-hero-bg')

const observer = new IntersectionObserver((entries) => {
    console.log(entries)
    if (firstcall == false) {
        setTimeout(Wakebg, 1);
        setTimeout(Hideherobg, 200);
       }
    firstcall = false
});

observer.observe(bottomElement)

function scrolll() {
    var left = document.querySelector(".portfolio-hero-bottom");
    $('#left-arrow-hidden').addClass('portfolio-items-holder-show');
    left.scrollBy(500, 0)
    console.log('pf-scrl-L')
}
function scrollr() {
    var right = document.querySelector(".portfolio-hero-bottom");
    right.scrollBy(-500, 0)
    console.log('pf-scrl-R')
}