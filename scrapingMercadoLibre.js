// Librerias utilizadas
// 1. Puppeteer
// 2. CheerioJS
// 3. Lenguaje utilizado: Node js

const rp = require("request-promise");
const url = "https://listado.mercadolibre.com.co/xiaomi#D[A:xiaomi]";
const $ = require("cheerio");

/**
 * Inicial metodo para escanear la url
 */
const scrapingPages = async () => {
  try {
    // Pagina inicial para realizar la búsqueda de las 5 primeras paginas
    const html = await rp(url);

    const pages = $(".ui-search-pagination > ul > li > a", html);
    if (!pages) {
      console.log("No existen datos para continuar");
      return;
    }

    const resp = [];

    for (let i = 0; i < 5; i++) {
      const page = pages[i].attribs.href;
      console.log(`Pagina ${i} ->`, page);
      // Metodo que va agregando al arreglo los productos
      await recursiveScraping(page, resp);
    }

    console.log(`Total productos encontrados -> ${resp.length}`);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Escanea la url para obtener los productos
 * @param {*} url String
 * @param {*} resp Array
 */
const recursiveScraping = async (url, resp) => {
  try {
    // Scraping URL
    const html = await rp(url);
    // Busca los items que hagan referencia al producto
    const obj = $("a > h2", html);
    if (!obj) {
      console.log(`No existe informacion url -> ${url}`);
      return;
    }
    const length = $("a > h2", html).length;

    for (let i = 0; i < length; i++) {
      // Verifica si el arreglo es vacio
      if (resp.length === 0) {
        resp.push(obj[i]);
      } else {
        // Si el arreglo no es vacio, verifica que el producto ya no se haya ingresado
        const exists = resp.find(
          (x) => x.children && x.children[0].data === obj[i].children[0].data
        );
        if (!exists) {
          resp.push(obj[i]);
        } else {
          console.log("Ya existe ->", obj[i].children[0].data);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Start metodo
scrapingPages();
