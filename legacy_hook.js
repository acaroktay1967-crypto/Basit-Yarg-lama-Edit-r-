window.__legacyHooksLoaded = true;
console.log("legacy_hooks loaded");

window.addEventListener("DOMContentLoaded", function () {
  var btnCmk = document.getElementById("btnLegacyCmk250");
  var btnSuc = document.getElementById("btnLegacySuc");
  var frame = document.getElementById("legacyFrame");

  if (!frame) {
    console.error("legacyFrame not found");
    return;
  }

  if (btnCmk) {
    btnCmk.addEventListener("click", function () {
      console.log("CMK250 click");
      frame.src = "legacy_repo/cmk250_mahkeme_editor.html";
    });
  } else {
    console.error("btnLegacyCmk250 not found");
  }

  if (btnSuc) {
    btnSuc.addEventListener("click", function () {
      console.log("SUC click");
      frame.src = "legacy_repo/suc_kutuphanesi_editor.html";
    });
  } else {
    console.error("btnLegacySuc not found");
  }
});