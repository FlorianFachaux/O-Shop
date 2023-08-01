class Cart {
  storage = {};

  addProduct(id, quantity) {
    if (!this.storage[id]) {
      this.storage[id] = 0;
    }
    this.storage[id] += quantity;
  }

  removeProduct(id, quantity) {
    if (this.storage[id]) {
      return;
    }
    if (this.storage[id] - quantity <= 0) {
      delete this.storage[id];
    }
    this.storage[id] -= quantity;
  }

  getProductResume(id) {
    return {
      id: 1,
      title: "Mug O'Shop",
      thumbnail: 'https://res.cloudinary.com/drhsq6nli/image/upload/v1683710188/2023-05-03_10h21_19_gmosfs.png',
      uniquePrice: 10,
      excerpt: "Pour faire le plein ? Non, ce n'est pas une carte fidélité de la station essence...",
      description:
        "Pour vous aider à absober l'essence du développeur web, LA CAFEINE ! Mais on n'oublie pas non plus les buveurs de thé évidemment! Ce joli mug fera votre bonheur !",
      category: 'Mug&Tasses',
      category_id: 2,
      quantity: 2,
      price: 20,
    };
  }

  //   Getresume renvoie un tableau de tous les elements contenues dans le panier aisnaue que leur prix totaux
  getAllResume() {
    const result = [];
    this.storage.forEach((id, quantity) => {
      result.push(this.getProductResume(id));
    });
    return result;
  }

  save() {}

  load() {}

  reset() {
    this.storage = {};
  }
}

const products = [
  {
    id: 1,
    title: "Mug O'Shop",
    thumbnail: 'https://res.cloudinary.com/drhsq6nli/image/upload/v1683710188/2023-05-03_10h21_19_gmosfs.png',
    price: 10,
    excerpt: "Pour faire le plein ? Non, ce n'est pas une carte fidélité de la station essence...",
    description:
      "Pour vous aider à absober l'essence du développeur web, LA CAFEINE ! Mais on n'oublie pas non plus les buveurs de thé évidemment! Ce joli mug fera votre bonheur !",
    category: 'Mug&Tasses',
    category_id: 2,
  },
];
const product = products[0];
const cart = new Cart();
cart.load();
cart.addProduct(product.id, 2);
cart.removeProduct(product.id, 1);
cart.save();
