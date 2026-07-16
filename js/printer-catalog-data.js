(function () {
  "use strict";

  const fdm = "FDM / FFF";
  const resina = "Resina";

  function modelo(id, nombre, tecnologia, volumenImpresion = "", cerrada = false, multicolorCompatible = false, variantes = []) {
    return {
      id,
      modelo: nombre,
      variante: "",
      variantes,
      tecnologia,
      volumenImpresion,
      cerrada,
      multicolorCompatible,
      estado: "activo",
      notas: ""
    };
  }

  // El catálogo identifica equipos. No contiene precios, potencia ni costos operativos.
  window.CatalogoImpresorasData = {
    version: 1,
    fechaActualizacion: "2026-07-15",
    marcas: [
      { id: "ankermake", nombre: "AnkerMake", modelos: [modelo("ankermake-m5c", "M5C", fdm, "220 x 220 x 250 mm")] },
      { id: "anycubic", nombre: "Anycubic", modelos: [
        modelo("anycubic-kobra-2", "Kobra 2", fdm, "220 x 220 x 250 mm"),
        modelo("anycubic-kobra-3", "Kobra 3", fdm, "250 x 250 x 260 mm", false, true),
        modelo("anycubic-photon-mono-m5s", "Photon Mono M5s", resina, "218 x 123 x 200 mm", true)
      ] },
      { id: "artillery", nombre: "Artillery", modelos: [
        modelo("artillery-sidewinder-x4-pro", "Sidewinder X4 Pro", fdm, "240 x 240 x 260 mm"),
        modelo("artillery-sidewinder-x4-plus", "Sidewinder X4 Plus", fdm, "300 x 300 x 400 mm")
      ] },
      { id: "bambu-lab", nombre: "Bambu Lab", modelos: [
        modelo("bambu-lab-a1-mini", "A1 mini", fdm, "180 x 180 x 180 mm", false, true),
        modelo("bambu-lab-a1", "A1", fdm, "256 x 256 x 256 mm", false, true),
        modelo("bambu-lab-p1p", "P1P", fdm, "256 x 256 x 256 mm", false, true),
        modelo("bambu-lab-p1s", "P1S", fdm, "256 x 256 x 256 mm", true, true),
        modelo("bambu-lab-x1-carbon", "X1 Carbon", fdm, "256 x 256 x 256 mm", true, true)
      ] },
      { id: "creality", nombre: "Creality", modelos: [
        modelo("creality-cr-10-se", "CR-10 SE", fdm, "220 x 220 x 265 mm"),
        modelo("creality-ender-3-v3", "Ender-3 V3", fdm, "220 x 220 x 250 mm"),
        modelo("creality-ender-3-v3-ke", "Ender-3 V3 KE", fdm, "220 x 220 x 240 mm"),
        modelo("creality-ender-3-v3-se", "Ender-3 V3 SE", fdm, "220 x 220 x 250 mm"),
        modelo("creality-k1", "K1", fdm, "220 x 220 x 250 mm", true),
        modelo("creality-k1c", "K1C", fdm, "220 x 220 x 250 mm", true),
        modelo("creality-k1-max", "K1 Max", fdm, "300 x 300 x 300 mm", true)
      ] },
      { id: "elegoo", nombre: "Elegoo", modelos: [
        modelo("elegoo-neptune-4", "Neptune 4", fdm, "225 x 225 x 265 mm"),
        modelo("elegoo-neptune-4-pro", "Neptune 4 Pro", fdm, "225 x 225 x 265 mm"),
        modelo("elegoo-neptune-4-plus", "Neptune 4 Plus", fdm, "320 x 320 x 385 mm"),
        modelo("elegoo-neptune-4-max", "Neptune 4 Max", fdm, "420 x 420 x 480 mm"),
        modelo("elegoo-mars-5-ultra", "Mars 5 Ultra", resina, "153 x 77 x 165 mm", true),
        modelo("elegoo-saturn-4-ultra", "Saturn 4 Ultra", resina, "219 x 123 x 220 mm", true)
      ] },
      { id: "flashforge", nombre: "FlashForge", modelos: [
        modelo("flashforge-adventurer-5m", "Adventurer 5M", fdm, "220 x 220 x 220 mm"),
        modelo("flashforge-adventurer-5m-pro", "Adventurer 5M Pro", fdm, "220 x 220 x 220 mm", true),
        modelo("flashforge-ad5x", "AD5X", fdm, "220 x 220 x 220 mm", false, true)
      ] },
      { id: "flsun", nombre: "FLSUN", modelos: [
        modelo("flsun-v400", "V400", fdm, "300 x 300 x 410 mm"),
        modelo("flsun-t1-pro", "T1 Pro", fdm, "260 x 260 x 330 mm", true),
        modelo("flsun-s1", "S1", fdm, "320 x 320 x 430 mm", true)
      ] },
      { id: "formlabs", nombre: "Formlabs", modelos: [
        modelo("formlabs-form-4", "Form 4", resina, "200 x 125 x 210 mm", true),
        modelo("formlabs-form-4l", "Form 4L", resina, "353 x 196 x 350 mm", true),
        modelo("formlabs-fuse-1-plus-30w", "Fuse 1+ 30W", "SLS", "165 x 165 x 300 mm", true)
      ] },
      { id: "generica-personalizada", nombre: "Genérica / Personalizada", modelos: [] },
      { id: "mingda", nombre: "Mingda", modelos: [
        modelo("mingda-magician-x2", "Magician X2", fdm, "230 x 230 x 260 mm")
      ] },
      { id: "phrozen", nombre: "Phrozen", modelos: [
        modelo("phrozen-sonic-mini-8k-s", "Sonic Mini 8K S", resina, "165 x 72 x 170 mm", true),
        modelo("phrozen-sonic-mighty-revo", "Sonic Mighty Revo", resina, "223 x 126 x 235 mm", true),
        modelo("phrozen-sonic-mega-8k-s", "Sonic Mega 8K S", resina, "330 x 185 x 400 mm", true)
      ] },
      { id: "prusa-research", nombre: "Prusa Research", modelos: [
        modelo("prusa-mini-plus", "MINI+", fdm, "180 x 180 x 180 mm"),
        modelo("prusa-mk4s", "MK4S", fdm, "250 x 210 x 220 mm"),
        modelo("prusa-core-one", "CORE One", fdm, "250 x 220 x 270 mm", true),
        modelo("prusa-xl", "XL", fdm, "360 x 360 x 360 mm", false, true)
      ] },
      { id: "qidi-tech", nombre: "Qidi Tech", modelos: [
        modelo("qidi-q1-pro", "Q1 Pro", fdm, "245 x 245 x 240 mm", true),
        modelo("qidi-plus4", "Plus4", fdm, "305 x 305 x 280 mm", true),
        modelo("qidi-x-max-3", "X-Max 3", fdm, "325 x 325 x 315 mm", true)
      ] },
      { id: "raise3d", nombre: "Raise3D", modelos: [
        modelo("raise3d-e2", "E2", fdm, "330 x 240 x 240 mm", true, true),
        modelo("raise3d-pro3", "Pro3", fdm, "300 x 300 x 300 mm", true, true),
        modelo("raise3d-pro3-plus", "Pro3 Plus", fdm, "300 x 300 x 605 mm", true, true)
      ] },
      { id: "snapmaker", nombre: "Snapmaker", modelos: [
        modelo("snapmaker-j1s", "J1s", fdm, "300 x 200 x 200 mm", true, true),
        modelo("snapmaker-artisan", "Artisan", fdm, "400 x 400 x 400 mm", true, true),
        modelo("snapmaker-2", "Snapmaker 2.0", fdm, "", false, false, ["A250T", "A350T"])
      ] },
      { id: "sovol", nombre: "Sovol", modelos: [
        modelo("sovol-sv06", "SV06", fdm, "220 x 220 x 250 mm"),
        modelo("sovol-sv06-plus", "SV06 Plus", fdm, "300 x 300 x 340 mm"),
        modelo("sovol-sv08", "SV08", fdm, "350 x 350 x 345 mm")
      ] },
      { id: "tronxy", nombre: "Tronxy", modelos: [
        modelo("tronxy-x5sa", "X5SA", fdm, "330 x 330 x 400 mm")
      ] },
      { id: "ultimaker", nombre: "UltiMaker", modelos: [
        modelo("ultimaker-s5", "S5", fdm, "330 x 240 x 300 mm", true, true),
        modelo("ultimaker-s7", "S7", fdm, "330 x 240 x 300 mm", true, true),
        modelo("ultimaker-factor-4", "Factor 4", fdm, "330 x 240 x 300 mm", true, true)
      ] },
      { id: "voron", nombre: "Voron", modelos: [
        modelo("voron-v0-2", "V0.2", fdm, "120 x 120 x 120 mm", true),
        modelo("voron-trident", "Trident", fdm, "", true, false, ["250 mm", "300 mm", "350 mm"]),
        modelo("voron-2-4", "2.4", fdm, "", true, false, ["250 mm", "300 mm", "350 mm"])
      ] }
    ]
  };
})();
