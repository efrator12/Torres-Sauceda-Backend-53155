//Se declara modulo de FYLESYSTEM:
const fs = require("fs");

// Se declara la clase PRODUCT MANAGER:
class ProductManager {
  // Se declara el constructor:
  constructor() {
    // Se declara arreglo vacio de PRODUCTOS:
    this.products = [];
    this.pathfile = "./data/products.json";
  }

  // Se declara funcion para añadir productosÑ
  addProducts = async (title, description, price, thumbnail, code, stock) => {
    // TRY/CATCH para validar que el archivo JSON no este vacio:
    try {
      const content = await fs.promises.readFile(this.pathfile, "utf-8"); // Se lee el archivo con FS y promesa.
      this.products = JSON.parse(content); // Se realiza PARSE para corregir el formato de JSON a ARRAY.
    } catch (error) {
      this.products = [];
    }

    // Se declara el nuevo OBJETO con sus atributos:
    const newProduct = {
      id: this.products.length + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    const productExist = this.products.find((p) => p.code === code); // Operacion para encontrar un codigo repetido:

    const productUndefined = Object.values(newProduct).some(
      (value) => value === undefined
    ); //Operacion para encontrar cualquier valor de la lista de productos que tenga un valor UNDEFINED:

    // Se filtra que no tenga valores UNDEFINED:
    if (productUndefined) {
      console.log(
        `--AÑADIR: Te faltan parametros para el producto con codigo: "${code}" y titulo: "${title}"`
      );
      return;
    } else {
      //Se filtra si hay valor CODE repetido:
      if (productExist) {
        console.log(
          `--AÑADIR: Ya existe el producto con el codigo: "${code}" y titulo: "${title}"`
        );
        return;
      } else {
        this.products.push(newProduct); // Se agrega Nuevo Producto al ARREGLO.
      }
    }
    await fs.promises.writeFile(this.pathfile, JSON.stringify(this.products)); // Se sobrescribe el ARREGLO hacia el documento JSON.
  };

  // Se declara funcion para obtener toda la lista:
  getProducts = async () => {
    // TRY/CATCH para validar que el archivo JSON no este vacio:
    try {
      const productsJSON = await fs.promises.readFile(this.pathfile, "utf-8");
      this.products = JSON.parse(productsJSON);
      console.log(
        "----------------------------------------------\nPRODUCTOS EN GENERAL:\n",
        this.products,
        "\n----------------------------------------------"
      );
    } catch (error) {
      console.log("--Sin informacion para GETPRODUCTS");
    }
  };

  // Se declara funcion para obtener productos por ID:
  getProductByID = async (id) => {
    // TRY/CATCH para validar que el archivo JSON no este vacio:
    try {
      const productsJSON = await fs.promises.readFile(this.pathfile, "utf-8");
      this.products = JSON.parse(productsJSON);

      const productExist = this.products.find((p) => p.id === id); //Operacion para devolver el procucto con ID a una variable.
      if (!productExist) {
        console.log(`--No existe el producto con el ID: ${id}`);
        return;
      } else {
        console.log(
          "----------------------------------------------\nPRODUCTOS POR ID:\n",
          productExist,
          "\n----------------------------------------------"
        );
        return productExist;
      }
    } catch (error) {
      console.log("--Sin informacion para GETPRODUCTBYID");
    }
  };

  // Se declara funcion para modificar productos por ID:
  updateProduct = async (id, dataProduct) => {
    const index = this.products.findIndex((p) => p.id === id); // Se busca el INDEX del producto que coincida con parametro ID.

    if (index < 0) {
      console.log(
        `--No existe el producto con el ID: ${id} para modificacion.`
      );
    } else {
      dataProduct.id = id; // Se rescribe el ID para que no cambie:

      this.products[index] = {
        ...this.products[index],
        ...dataProduct,
      };
      await fs.promises.writeFile(this.pathfile, JSON.stringify(this.products)); // Se sobrescribe el ARREGLO hacia el documento JSON.
      console.log(
        "----------------------------------------------\nPRODUCTO MODIFICADO:\n",
        this.products[index],
        "\n----------------------------------------------"
      );
    }
  };

  // Se declara funcion para eliminar productos por ID:
  deleteProduct = async (id) => {
    const productExist = this.products.find((p) => p.id === id); // Se busca que el que el producto a eliminar exista (para log de error).
    if (!productExist) {
      console.log(`--No existe el producto con el ID: ${id}`);
      return;
    } else {
      this.products = this.products.filter((p) => p.id !== id); // Funcion para FILTRAR (quitar) todo lo diferente al ID del parametro.
      await fs.promises.writeFile(this.pathfile, JSON.stringify(this.products)); // Se sobrescribe el ARREGLO hacia el documento JSON.
      console.log(
        "----------------------------------------------\nPRODUCTOS RESTANTES:\n",
        this.products,
        "\n----------------------------------------------"
      );
    }
  };
}

pMANAGER = new ProductManager(); //Se declara variable con la clase.

// Se crea la funcion para que se declaren las funciones asincronas.
const funcionesAsincronas = async () => {
  // Se añaden productos a la clase:
  await pMANAGER.addProducts(
    "Camisa Manga Larga",
    "Azul",
    199,
    "https://www.google.com",
    "adf123",
    15
  );
  await pMANAGER.addProducts(
    "Pantalon",
    "Negro",
    699,
    "https://www.google.com",
    "adf321",
    5
  );
  await pMANAGER.addProducts(
    "Pans",
    "Azul",
    299,
    "https://www.google.com",
    "adf321",
    5
  );
  await pMANAGER.addProducts(
    "Guantes",
    "Multicolor",
    199,
    "https://www.google.com",
    "adf654"
  );
  await pMANAGER.addProducts(
    "Chaleco",
    "Negro",
    599,
    "https://www.google.com",
    "adf789",
    9
  );

  // Se solicitan todos los productos:
  await pMANAGER.getProducts();

  // Se solicitan los productos por ID
  // En el FOR se introduce el length del arreglo del archivo en JSON:
  for (
    let i = 0;
    i <=
    Object.keys(JSON.parse(fs.readFileSync(pMANAGER.pathfile, "utf-8"))).length;
    i++
  ) {
    await pMANAGER.getProductByID(i);
  }

  // Se modifican los productos por ID:
  await pMANAGER.updateProduct(2, {
    id: 999, // No se podra modificar
    title: "Chamarra", // Solo se modifica el Title.
    price: 199,
  });

  // Se elimina el producto por ID:
  await pMANAGER.deleteProduct(3); // Se elimina el producto con ID 3.
};

funcionesAsincronas(); // EJECUCION DE FUNCIONES ASINCRONAS.
