import Storage from "./storage.js";

export default class CategoryView {
    constructor() {
        // variables
        this.ctgTitleInput = document.querySelector("#categoryTitle")
        this.ctgDescInput = document.querySelector("#categoryDescription")
        this.ctgCacelBtn = document.querySelector("#categoryCanelBtn")
        this.ctgAddBtn = document.querySelector("#categoryAddNewBtn")
        this.ctgSelect = document.querySelector("#categoriesSelect")
        // event listeners
        this.ctgAddBtn.addEventListener("click", () => {
            this.addNewCategory()
        })
        this.ctgCacelBtn.addEventListener("click", () => {
            this.ctgTitleInput.value = ' '
            this.ctgDescInput.value = ' '
        })
    }

    setupApp() {
        this.instantCtgUpdate(Storage.getCategories())
    }

    addNewCategory() {
        const categoryTitle = this.ctgTitleInput.value.trim()
        const categoryDescription = this.ctgDescInput.value.trim()

        if (categoryTitle.length >= 2) {
            const savedCategories = Storage.getCategories();
            const existedItem = savedCategories.find((c) => c.title.trim().toLowerCase() === categoryTitle.toLowerCase());

            if (existedItem) {
                existedItem.title = categoryTitle;
                existedItem.description = categoryDescription;
                Storage.saveCategories(savedCategories)
                this.instantCtgUpdate(savedCategories)
                this.resetCategoryForm()
                alert("this category name has been added before so we will update the category description!")
                return
            }

            const newCategory = {
                id: new Date().getTime(),
                title: categoryTitle,
                description: categoryDescription,
                createdAt: new Date().toISOString()
            }

            savedCategories.push(newCategory);
            Storage.saveCategories(savedCategories)
            this.instantCtgUpdate(savedCategories)
            this.resetCategoryForm()
        } else {
            alert("your entered title for category must be at least 2 characters!!!")
        }
    }

    instantCtgUpdate(categories) {
        const ctgListTitles = categories.map(obj => obj.title.trim())
        // create option for each category
        this.ctgSelect.innerHTML = ` <option selected value="none">- select category -</option>  `
        ctgListTitles.forEach(option => {
            const newOption = document.createElement("option")
            newOption.value = option;
            newOption.textContent = option;
            // append new created option to select tg
            this.ctgSelect.append(newOption)
        });
    }

    resetCategoryForm() {
        this.ctgTitleInput.value = ''
        this.ctgDescInput.value = ''
    }

}
