import Storage from "./storage.js";
import { t } from "./i18n.js";

export default class ProductView {
    constructor() {
        // variables
        this.pdtTitle = document.querySelector("#productTitle")
        this.pdtIncQty = document.querySelector("#incQty")
        this.pdtDecQty = document.querySelector("#decQty")
        this.pdtLocation = document.querySelector("#productLocations")
        this.ctgSelect = document.querySelector("#categoriesSelect")
        this.pdtAddNew = document.querySelector("#addNewProductBtn")
        this.pdtQty = document.querySelector("#productQuantity")
        this.productCenter = document.querySelector("#productsCenter")
        this.toggleBtns = document.querySelectorAll(".toggleBtn")
        this.searchInput = document.querySelector("#searchInput")
        this.sortSelect = document.querySelector("#sort")
        this.productError = document.querySelector("#productError")
        // event listeners
        this.pdtAddNew.addEventListener("click", () => {
            this.addNewProduct()
        })
        this.toggleBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                this.toggleProductQty(e)
            })
        })
        this.searchInput.addEventListener("keyup", (e) => {
            this.searchProducts(e.target.value)
        })
        this.sortSelect.addEventListener("change", (e) => {
            this.sortBySelect(e.target.value)
        })
        document.addEventListener("languagechange", () => {
            this.showProductError("")
            this.sortBySelect(this.sortSelect.value)
        })
    }

    setupApp() {
        this.updateQuantityControls()
        this.sortBySelect(this.sortSelect.value)
    }

    addNewProduct() {
        const validationMessage = this.validateProductForm()
        if (validationMessage) {
            this.showProductError(validationMessage)
            return
        }

        const newProduct = {
            id: new Date().getTime(),
            title: this.pdtTitle.value.trim(),
            quantity: this.getCurrentQuantity(),
            location: this.pdtLocation.value,
            category: this.ctgSelect.value,
            persianDate: new Date().toLocaleDateString("fa-IR")
        }

        const pdtList = Storage.getProducts
        pdtList.push(newProduct)
        Storage.saveProducts(pdtList)
        this.resetProductForm()
        this.showProductError("")
        this.sortBySelect(this.sortSelect.value)
    }

    showListedProducts(productList) {
        this.productCenter.replaceChildren()
        productList.forEach(product => {
            const listItem = document.createElement("li")
            listItem.className = "flex items-center justify-between w-full py-2 bg-blue-400/ text-white font-medium ss:min-w-[500px] ss:overflow-x-auto"

            listItem.append(
                this.createProductText(product.title),
                this.createProductText(product.location),
                this.createProductText(product.category),
                this.createProductText(product.persianDate, "basis-[16%] font-vazir ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]"),
                this.createProductText(product.quantity, "border-2 border-slate-400 p-1 rounded-2xl ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]"),
                this.createDeleteButton(product)
            )

            this.productCenter.append(listItem)
        })
    }

    toggleProductQty(e) {
        const currentQuantity = this.getCurrentQuantity()
        switch (e.currentTarget.id) {
            case "incQty":
                this.setQuantity(currentQuantity + 1)
                break;
            case "decQty":
                this.setQuantity(Math.max(0, currentQuantity - 1))
                break;
        }
    }

    deleteProduct(productId) {
        Storage.removeProduct(productId)
        this.sortBySelect(this.sortSelect.value)
    }

    searchProducts(searchTerm) {
        const addedProducts = Storage.getProducts
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        const filteredProducts = addedProducts.filter((product) =>
            product.title.toLowerCase().trim().includes(normalizedSearchTerm)
        );
        this.showListedProducts(filteredProducts);
    }

    sortBySelect(sortType) {
        let saveProducts = Storage.getProducts
        let sortedProducts = [];
        if (sortType === "newest") {
            sortedProducts = saveProducts.slice().sort((a, b) => b.id - a.id);
        } else if (sortType === "oldest") {
            sortedProducts = saveProducts.slice().sort((a, b) => a.id - b.id);
        } else if (sortType ==="A-Z" ){
            sortedProducts = saveProducts.slice().sort((a,b)=> a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
        } else if (sortType ==="Z-A" ){
            sortedProducts = saveProducts.slice().sort((a,b)=> a.title.toLowerCase().localeCompare(b.title.toLowerCase())).reverse()
        } else {
            sortedProducts = saveProducts.slice();
        }
        this.showListedProducts(sortedProducts);
    }

    validateProductForm() {
        if (this.pdtTitle.value.trim().length < 2) {
            return t("productTitleTooShort")
        }
        if (this.pdtLocation.value === "none") {
            return t("productLocationRequired")
        }
        if (this.ctgSelect.value === "none") {
            return t("productCategoryRequired")
        }
        if (this.getCurrentQuantity() < 0) {
            return t("productQuantityNegative")
        }
        return ""
    }

    resetProductForm() {
        this.pdtTitle.value = ""
        this.setQuantity(0)
        this.pdtLocation.value = "none"
        this.ctgSelect.value = "none"
    }

    getCurrentQuantity() {
        const quantity = Number(this.pdtQty.innerText)
        return Number.isFinite(quantity) ? quantity : 0
    }

    setQuantity(quantity) {
        this.pdtQty.innerText = String(Math.max(0, quantity))
        this.updateQuantityControls()
    }

    updateQuantityControls() {
        this.pdtDecQty.disabled = this.getCurrentQuantity() === 0
        this.pdtDecQty.classList.toggle("opacity-50", this.pdtDecQty.disabled)
        this.pdtDecQty.classList.toggle("cursor-not-allowed", this.pdtDecQty.disabled)
    }

    showProductError(message) {
        if (!this.productError) return
        this.productError.textContent = message
        this.productError.classList.toggle("hidden", !message)
    }

    createProductText(value, className = "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]") {
        const text = document.createElement("p")
        text.className = className
        text.textContent = value
        return text
    }

    createDeleteButton(product) {
        const deleteButton = document.createElement("button")
        deleteButton.type = "button"
        deleteButton.className = "pdt-dlt-btn flex items-center justify-center text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-main rounded"
        deleteButton.setAttribute("aria-label", t("deleteProduct", { title: product.title }))
        deleteButton.addEventListener("click", () => this.deleteProduct(Number(product.id)))
        deleteButton.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                this.deleteProduct(Number(product.id))
            }
        })
        deleteButton.append(this.createDeleteIcon())
        return deleteButton
    }

    createDeleteIcon() {
        const svgNamespace = "http://www.w3.org/2000/svg"
        const icon = document.createElementNS(svgNamespace, "svg")
        icon.setAttribute("class", "stroke-current dd:h-6 dd:w-6 ss:h-5 ss:w-5")
        icon.setAttribute("fill", "none")
        icon.setAttribute("viewBox", "0 0 24 24")
        icon.setAttribute("stroke-width", "1.5")
        icon.setAttribute("aria-hidden", "true")

        const path = document.createElementNS(svgNamespace, "path")
        path.setAttribute("stroke-linecap", "round")
        path.setAttribute("stroke-linejoin", "round")
        path.setAttribute("d", "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0")

        icon.append(path)
        return icon
    }

}
