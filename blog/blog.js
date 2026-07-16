(function () {
  "use strict";

  const ESTADOS_PUBLICOS = new Set(["published"]);
  const postsList = document.getElementById("postsList");
  const featuredPosts = document.getElementById("featuredPosts");
  const searchInput = document.getElementById("blogSearch");
  const categorySelect = document.getElementById("blogCategory");
  const year = document.getElementById("blogFooterYear");
  let postsPublicados = [];

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function limpiarTexto(valor) {
    return String(valor || "").trim();
  }

  function crearTexto(etiqueta, texto, clase) {
    const elemento = document.createElement(etiqueta);
    elemento.textContent = texto;
    if (clase) {
      elemento.className = clase;
    }
    return elemento;
  }

  function normalizarPost(post) {
    return {
      id: limpiarTexto(post.id),
      slug: limpiarTexto(post.slug),
      title: limpiarTexto(post.title),
      description: limpiarTexto(post.description),
      datePublished: limpiarTexto(post.datePublished),
      dateModified: limpiarTexto(post.dateModified),
      category: limpiarTexto(post.category),
      tags: Array.isArray(post.tags) ? post.tags.map(limpiarTexto).filter(Boolean) : [],
      image: limpiarTexto(post.image),
      status: limpiarTexto(post.status),
      featured: Boolean(post.featured)
    };
  }

  function crearTarjeta(post) {
    const articulo = document.createElement("article");
    articulo.className = "post-card";

    if (post.image) {
      const imagen = document.createElement("img");
      imagen.src = post.image;
      imagen.alt = "";
      imagen.width = 640;
      imagen.height = 360;
      imagen.loading = "lazy";
      articulo.appendChild(imagen);
    }

    const meta = crearTexto("p", `${post.category || "Guía"} · ${post.datePublished || "Sin fecha"}`, "post-card__meta");
    const titulo = crearTexto("h3", post.title || "Artículo sin título");
    const descripcion = crearTexto("p", post.description || "Sin descripción disponible.");
    const enlace = document.createElement("a");
    enlace.className = "blog-button";
    enlace.href = `articulos/${encodeURIComponent(post.slug)}.html`;
    enlace.textContent = "Leer artículo";

    articulo.append(meta, titulo, descripcion, enlace);
    return articulo;
  }

  function mostrarVacio(contenedor, texto) {
    contenedor.replaceChildren(crearTexto("p", texto, "empty-state"));
  }

  function poblarCategorias(posts) {
    const categorias = [...new Set(posts.map((post) => post.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
    categorias.forEach((categoria) => {
      const opcion = document.createElement("option");
      opcion.value = categoria;
      opcion.textContent = categoria;
      categorySelect.appendChild(opcion);
    });
  }

  function filtrarPosts() {
    const busqueda = limpiarTexto(searchInput?.value).toLowerCase();
    const categoria = limpiarTexto(categorySelect?.value);

    return postsPublicados.filter((post) => {
      const coincideCategoria = !categoria || post.category === categoria;
      const texto = [post.title, post.description, post.category, post.tags.join(" ")].join(" ").toLowerCase();
      return coincideCategoria && (!busqueda || texto.includes(busqueda));
    });
  }

  function renderizar() {
    const filtrados = filtrarPosts();
    const destacados = filtrados.filter((post) => post.featured);

    if (destacados.length) {
      featuredPosts.replaceChildren(...destacados.slice(0, 6).map(crearTarjeta));
    } else {
      mostrarVacio(featuredPosts, "Aún no hay artículos destacados publicados.");
    }

    if (filtrados.length) {
      postsList.replaceChildren(...filtrados.map(crearTarjeta));
    } else {
      mostrarVacio(postsList, "No hay artículos publicados que coincidan con la búsqueda.");
    }
  }

  async function cargarPosts() {
    try {
      const respuesta = await fetch("posts.json", { cache: "no-store" });
      if (!respuesta.ok) {
        throw new Error(`No se pudo cargar posts.json (${respuesta.status})`);
      }
      const datos = await respuesta.json();
      postsPublicados = Array.isArray(datos.posts)
        ? datos.posts.map(normalizarPost).filter((post) => ESTADOS_PUBLICOS.has(post.status) && post.slug)
        : [];
      postsPublicados.sort((a, b) => (b.datePublished || "").localeCompare(a.datePublished || ""));
      poblarCategorias(postsPublicados);
      renderizar();
    } catch (error) {
      console.warn("No fue posible cargar el listado del blog.", error);
      mostrarVacio(featuredPosts, "No se pudo cargar el listado de artículos.");
      mostrarVacio(postsList, "El blog no está disponible temporalmente. Intenta abrir artículos enlazados directamente.");
    }
  }

  searchInput?.addEventListener("input", renderizar);
  categorySelect?.addEventListener("change", renderizar);
  cargarPosts();
})();
