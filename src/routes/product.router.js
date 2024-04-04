import express from "express"
import { configureProductMulter } from "../util.js";
import productController from "../dao/controllers/product.controller.js";

const productRouter = express.Router();
const imgUpload = configureProductMulter();

// Ruta para renderizar la vista de productos en tiempo real
productRouter.get("/", productController.getProducts);

// Maneja la solicitud de para ver los detalles del producto
productRouter.get("/:id", productController.getProductDetail);

productRouter.get("/category/:category", productController.getProductCategory);

// Manejar la solicitud de agregar un producto en tiempo real
productRouter.post("/", imgUpload.single("image"), productController.addProduct);

// Manejar la solicitud de eliminación de un producto en tiempo real
productRouter.delete('/:id', productController.deleteProduct);

export default productRouter;