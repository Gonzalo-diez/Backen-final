import express from "express";
import cartController from "../dao/controllers/cart.controller.js";
import { authToken, isUser } from "../config/auth.js";

const cartRouter = express.Router();
// Para rutas protegidas const protectWithJWT = passport.authenticate("jwt", { session: false });

// Maneja la solicitud de renderizar el carrito
cartRouter.get("/:cid", authToken, isUser, cartController.getCartById);

// Maneja la solicitud de agregar el producto al carrito
cartRouter.post("/", isUser, authToken, cartController.addProductToCart);

// Maneja la solicitud para actualizar el carrito con nuevos productos
cartRouter.put("/:cid", isUser, authToken, cartController.updateCart);

// Maneja la solicitud para actualizar la cantidad de algun producto dentro del carrito
cartRouter.put("/:cid/products/:pid", isUser, authToken, cartController.updateProductQuantityInCart);

// Maneja la solicitud para borrar el producto seleccionado del carrito
cartRouter.delete("/:cid/products/:pid", isUser, authToken, cartController.deleteProductFromCart);

// Maneja la solicitud para limpiar el carrito
cartRouter.delete("/:cid", isUser, authToken, cartController.clearCart);

export default cartRouter;