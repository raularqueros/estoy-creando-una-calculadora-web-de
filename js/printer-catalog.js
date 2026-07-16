(function () {
  "use strict";

  const datos = () => window.CatalogoImpresorasData || { marcas: [] };
  const limpiar = (valor) => String(valor ?? "").trim().toLocaleLowerCase("es");
  const copiar = (valor) => valor ? JSON.parse(JSON.stringify(valor)) : null;

  function obtenerMarcas() {
    return copiar(datos().marcas || []).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }

  function obtenerModelosPorMarca(marcaId) {
    const marca = (datos().marcas || []).find((item) => item.id === marcaId);
    return copiar(marca?.modelos || []).sort((a, b) => a.modelo.localeCompare(b.modelo, "es"));
  }

  function obtenerModeloPorId(modeloId) {
    for (const marca of datos().marcas || []) {
      const modelo = (marca.modelos || []).find((item) => item.id === modeloId);
      if (modelo) return copiar({ ...modelo, marcaId: marca.id, marca: marca.nombre });
    }
    return null;
  }

  function buscarModelos(consulta) {
    const termino = limpiar(consulta);
    if (!termino) return [];
    return (datos().marcas || []).flatMap((marca) => (marca.modelos || [])
      .filter((modelo) => limpiar(`${marca.nombre} ${modelo.modelo} ${(modelo.variantes || []).join(" ")}`).includes(termino))
      .map((modelo) => copiar({ ...modelo, marcaId: marca.id, marca: marca.nombre })))
      .slice(0, 12);
  }

  function obtenerVariantes(modeloId) {
    return obtenerModeloPorId(modeloId)?.variantes || [];
  }

  function crearDatosInicialesPerfil(modeloId, variante = "") {
    const modelo = obtenerModeloPorId(modeloId);
    if (!modelo) return null;
    return {
      marca: modelo.marca,
      modelo: modelo.modelo,
      variante: String(variante || modelo.variante || ""),
      tecnologia: modelo.tecnologia,
      volumenImpresion: modelo.volumenImpresion || "",
      cerrada: Boolean(modelo.cerrada),
      multicolorCompatible: Boolean(modelo.multicolorCompatible)
    };
  }

  window.CatalogoImpresoras3D = {
    obtenerMarcas,
    obtenerModelosPorMarca,
    obtenerModeloPorId,
    buscarModelos,
    obtenerVariantes,
    crearDatosInicialesPerfil
  };
})();
