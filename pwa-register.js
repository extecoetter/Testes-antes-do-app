if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/Testes-antes-do-app/sw.js", {
      scope: "/Testes-antes-do-app/"
    }).catch(function (err) {
      console.error("Falha ao registrar service worker:", err);
    });
  });
}
