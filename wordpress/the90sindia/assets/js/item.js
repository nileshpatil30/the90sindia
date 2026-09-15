/* ==========================================================================
   90s REWIND — item page player
   ==========================================================================
   Swaps the still for the real player on click. Until then nothing is
   requested from YouTube, so a visitor who never presses play never contacts
   it — the page is lighter and sets no third-party cookies.
   ========================================================================== */

(function () {
  "use strict";

  function wire(holder) {
    const poster = holder.querySelector(".item-player-poster");
    const embed = holder.getAttribute("data-embed");
    if (!poster || !embed) return;

    /* A still that cannot load would leave only a play button floating on
       black, so drop straight to the player instead. */
    const art = poster.querySelector("img");
    if (art) {
      art.addEventListener("error", function () {
        if (!poster.isConnected) return;
        load(holder, embed, false);
      });
    }

    poster.addEventListener("click", function () {
      load(holder, embed, true);
    });
  }

  function load(holder, embed, autoplay) {
    const frame = document.createElement("iframe");
    frame.src = autoplay ? embed : embed.replace(/([?&])autoplay=1&?/, "$1");
    frame.title = document.title;
    frame.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    frame.allowFullscreen = true;
    holder.innerHTML = "";
    holder.appendChild(frame);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".item-player[data-embed]").forEach(wire);
  });
}());
