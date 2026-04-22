(function () {
    const STORAGE_KEY = "chiambucket-banner-dismissed";
    /*
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      return;
    }
    */
  
    if (document.getElementById("chiambucket-banner")) {
      return;
    }
  
    const banner = document.createElement("div");
    banner.id = "chiambucket-banner";
    banner.innerHTML = `
        <div id="chiambucket-banner-inner">
            <img src="https://www.chiambucket.com/images/logo.png" alt="">
            <div id="chiambucket-banner-inside">
                <a href="https://www.chiambucket.com">Visit Chiambucket</a>
            </div>
            <button id="chiambucket-banner-close" type="button" aria-label="Close banner">
              &times;
            </button>
        </div>
    `;
  
    const style = document.createElement("style");
    style.textContent = `
    #chiambucket-banner {
        position: sticky;
        top: 90%;
        left: 10px;
        z-index: 999999;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 999px;
        box-sizing: border-box;
        background: linear-gradient(90deg, #1f1f1f, #2b2b2b);
        color: #f3f3f3;
        border-top: 1px solid #636363;
        border-left: 1px solid #636363;
        box-shadow: 0 4px 18px rgba(0,0,0,0.25);
        font-family: Arial, sans-serif;
        transition: 500ms ease;
        overflow: hidden;
    }

    #chiambucket-banner:hover {
        width: 300px;
    }

    #chiambucket-banner:hover #chiambucket-banner-close {
        display: block;
    }
    #chiambucket-banner:hover #chiambucket-banner-inside a{
        color: #f3f3f3;
        text-decoration: none;
        font-size: 0.8rem;
        transition: 500ms ease;
        font-family: Arial, Helvetica, sans-serif;
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transition-delay: 0.25s, 0.25s;
    }  
    #chiambucket-banner:hover #chiambucket-banner-inside {
        width: unset;
    }
    #chiambucket-banner-inner {
        position: relative;
        padding: 5px 10px;
        text-align: center;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        width: 100%;
    }
    #chiambucket-banner-inner img {
        width: 30px;
    }
    #chiambucket-banner-inside {
        width: 0;
    }
    #chiambucket-banner-inside a {
        color: #f3f3f3;
        border-radius: 36px;
        background: linear-gradient(175deg, rgb(78, 77, 77) 0%, rgb(65, 64, 64) 100%);
        border-top: 1px solid #636363;
        border-left: 1px solid #636363;
        padding: 5px 10px;
        opacity: 0;
        width: 0;
        visibility: hidden;
        pointer-events: none;
        transition:
        opacity 0.2s ease,
        visibility 0s linear 0.5s;
    }

    #chiambucket-banner-close {
        display: none;
        background: none;
        border: none;
        color: #f3f3f3;
        font-size: 20px;
        cursor: pointer;
        line-height: 1;
        padding-left: 10px;
    }

    #chiambucket-banner-close:hover {
        opacity: 0.75;
    }
    `;
  
    document.head.appendChild(style);
  
    const target = document.body;
    if (!target) return;
  
    target.prepend(banner);
  
    const closeButton = document.getElementById("chiambucket-banner-close");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        banner.remove();
        localStorage.setItem(STORAGE_KEY, "1");
      });
    }
  })();