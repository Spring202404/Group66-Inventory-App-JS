import ProductView from "./productView.js";
import CategoryView from "./categoryView.js";
import { initI18n } from "./i18n.js";


document.addEventListener("DOMContentLoaded", ()=>{
    initI18n()
    const productView = new ProductView()
    const categoryView = new CategoryView()
    categoryView.setupApp()
    productView.setupApp()
})
