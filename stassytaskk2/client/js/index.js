let searchIcon = document.getElementById("searchIcon")
let searchInput = document.getElementById("searchInput")
let productRow = document.querySelector(".productRow")
let clearList = document.getElementById("clearList")
const API_URL = 'http://localhost:5000/products'
let pageSize = 4;
let currentPage = 1;
(function () {
    var toggles = document.querySelectorAll(".icon");
    for (var i = toggles.length - 1; i >= 0; i--) {
        var toggle = toggles[i];
        toggleHandler(toggle);
    };
    function toggleHandler(toggle) {
        toggle.addEventListener("mouseenter", function (e) {
            e.preventDefault();
            this.classList.add('is-active');
        })
        toggle.addEventListener('mouseleave', function (e) {
            this.classList.remove('is-active');
        });
    }
})();

searchIcon.addEventListener("click", function () {
    searchInput.classList.toggle("d-none")
})
searchInput.addEventListener("keyup", async function () {
    let searchResult = []
    await getProducts(productsData)
    productRow.innerHTML = ''
    searchResult = productsData.filter(product => product.name.toLowerCase().includes(searchInput.value.toLowerCase()))
    renderProducts(searchResult)
    if (searchResult.length === 0) {
        return productRow.innerHTML = "<h2 class='text-danger text-uppercase'>Not Found...</h2>"
    }
    if (searchInput.value == 0) {
        renderProducts(productsData)
    }
})
clearList.addEventListener("click", function (products) {
    searchInput.value = ""
    renderProducts(productsData)
})

async function deleteItem(id) {
    await getProducts(productsData)
    productRow.innerHTML = ''
    if (window.confirm("Delete?")) {
        let deletedItem = productsData.filter(x => x._id != id);
        renderProducts(deletedItem);
        fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' })
    } else {
        renderProducts(productsData)
    }
}
var productsData = []
window.addEventListener('DOMContentLoaded', getProducts)
async function getProducts() {
    const response = await fetch(API_URL)
    const products = await response.json();
    productsData = products
    renderProducts(products)
}

async function renderProducts(products) {
    if (currentPage === 1) {
        document.querySelector("#prevButton").setAttribute("disabled", "true")
    } else {
        document.querySelector("#prevButton").removeAttribute("disabled")
    }
    let col = ""
    let filteredProducts = products.filter((row, index) => {
        let start = (currentPage - 1) * pageSize
        let end = currentPage * pageSize
        if (index >= start && index < end) return true
    })
    filteredProducts.forEach(product => {
        col += ` <div class="col col-lg-3 col-sm-12 col-md-6 d-flex justify-content-center align-items-center my-sm-5 ">
                        <div class="d-flex justify-content-center align-items-center flex-column mt-5 Card">
                            <div class="imgDiv">
                                <img
                                    src=${product.imgUrl} />
                                <div class="hoverEffect">
                                    <button
                                        class="text-uppercase border border-3 p-1 border-white bg-transparent text-light" onclick="deleteItem('${product._id}')">remove from list</button>
                                </div>
                            </div>
                            <div class="CardBody">
                                <h3>${product.name}</h3>
                                <h4>${product.price}</h4>
                                <div>
                                    <button class="p-3 border-0"  onclick="deleteItem('${product._id}')"><i class="fa-solid fa-trash text-secondary fs-5"></i></button>
                                    <button class="p-3 border-0"><i
                                            class="fa-solid fa-basket-shopping text-secondary fs-5"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>`
    })
    productRow.innerHTML = col
}
function previousPage(products) {
    if (currentPage > 1) {
        currentPage--
        renderProducts(products)
    }
}
function nextPage(products) {
    if ((currentPage * pageSize) < products.length)
        currentPage++
    renderProducts(products)
}
document.querySelector("#prevButton").addEventListener("click", () => previousPage(productsData))
document.querySelector("#nextButton").addEventListener("click", () => nextPage(productsData))


