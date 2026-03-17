if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/APPclimatizacao/sw.js", {
      scope: "/APPclimatizacao/"
    }).catch(function (err) {
      console.error("Falha ao registrar service worker:", err);
    });
  });
}
