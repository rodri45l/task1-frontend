const bookstore = document.querySelector('#bookstore');
const cartCounter = document.querySelector('#cart-count');
const cartItems = [];
let currentView = 'list';
let booksData;


function renderCart() {
    const cartContainer = document.querySelector('#cart-items');
    let output = '<table class="cart-table"><thead><tr><th>Title</th><th>Qty</th><th>Price</th><th>Sum</th></tr></thead><tbody>';
    let total = 0;

    // Create an object to keep track of the book counts
    const bookCounts = {};

    // Count the books in the cart
    cartItems.forEach(item => {
        if (bookCounts[item.id]) {
            bookCounts[item.id].count++;
        } else {
            bookCounts[item.id] = { ...item, count: 1 };
        }
    });

    // Render each book in the cart
    Object.values(bookCounts).forEach(book => {
        const rowSum = book.count * book.price;
        output += `
        <tr>
          <td>${book.title}</td>
          <td>${book.count}</td>
          <td>$${book.price.toFixed(2)}</td>
          <td>$${rowSum.toFixed(2)}</td>
        </tr>
      `;
        total += rowSum;
    });

    // Render the total sum
    output += `
      <tr class="cart-total">
        <td>Total:</td>
        <td></td>
        <td></td>
        <td>$${total.toFixed(2)}</td>
      </tr>
    </tbody></table>`;
    cartContainer.innerHTML = output;
}

fetch('./books.json')
    .then(response => response.json())
    .then(books => {


        booksData = books; // assign the fetched data to the booksData variable
        renderBooks(booksData); // render the initial list of books
        let output = `<div class="row mb-4">
        <div class="col-md-4">
          <select class="form-select filter-select" aria-label="Filter by Category">
            <option selected>Filter by Category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </select>
        </div>
        <div class="col-md-4">
          <select class="form-select filter-select" aria-label="Filter by Author">
            <option selected>Filter by Author</option>
            <option value="author1">Author 1</option>
            <option value="author2">Author 2</option>
            <option value="author3">Author 3</option>
          </select>
        </div>
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input type="number" class="form-control" placeholder="Min Price">
            <span class="input-group-text">-</span>
            <input type="number" class="form-control" placeholder="Max Price">
          </div>
        </div>
      </div>
      
      <div class="row mb-4">
      <div class="col-md-12">
        <label for="sort-dropdown" class="form-label">Sort By:</label>
        <select class="form-select" id="sort-dropdown">
          <option value="title-asc">Title (Ascending)</option>
          <option value="title-desc">Title (Descending)</option>
          <option value="price-asc">Price (Ascending)</option>
          <option value="price-desc">Price (Descending)</option>
          <option value="author-asc">Author (Ascending)</option>
          <option value="author-desc">Author (Descending)</option>
        </select>
      </div>
    </div>
    
      `;

        books.forEach(book => {
            output += `
                <div class="card mb-3" style="position: relative; z-index: 1;">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <img src="${book.image}" alt="${book.title}">
                    </div>
                    <div class="col-md-8">
                      <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text"><small class="text-muted">${book.author}</small></p>
                        <button class="btn btn-primary view-details" data-book-id="${book.id}" data-book-title="${book.title}" data-book-price="${book.price}">View Details</button>
                        <button class="btn btn-success add-to-cart" data-book-id="${book.id}" data-book-title="${book.title}" data-book-price="${book.price}">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              `;

        });



        bookstore.innerHTML = output;

        // Add event listener to all "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });

        // Function to add book to cart
        function addToCart(event) {
            const bookId = event.target.dataset.bookId;
            const bookTitle = event.target.dataset.bookTitle;
            const bookPrice = parseFloat(event.target.dataset.bookPrice);
            console.log(`Added book with ID ${bookId} to cart`);

            // Add the book to the cartItems array
            cartItems.push({ id: bookId, title: bookTitle, price: bookPrice });

            // Render the shopping cart
            renderCart();

            // Get the current number of items in the cart
            let itemCount = parseInt(cartCounter.innerText);

            // Increment the item count
            itemCount++;

            // Update the counter
            cartCounter.innerText = itemCount;

            // Hide the shopping cart

        }

        const cartButton = document.querySelector('#cart-button');
        const cartContainer = document.querySelector('#cart-container');

        cartButton.addEventListener('click', () => {
            cartContainer.classList.toggle('show');
        });

        const viewDetailsButtons = document.querySelectorAll('.view-details');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', viewDetails);
        });

        function viewDetails(event) {
            const bookId = event.target.dataset.bookId;
            const bookTitle = event.target.dataset.bookTitle;
            const bookPrice = parseFloat(event.target.dataset.bookPrice);

            // Hide the regular view
            const regularView = document.querySelector('.bookstore');
            regularView.classList.add('d-none');

            // Show the detailed view
            const detailedView = document.querySelector('#detailed-view');
            detailedView.classList.remove('d-none');

            // Populate the detailed view with book information
            const detailedImage = document.querySelector('#detailed-image');
            const detailedTitle = document.querySelector('#detailed-title');
            const detailedDescription = document.querySelector('#detailed-description');
            const detailedAuthor = document.querySelector('#detailed-author');
            const detailedPrice = document.querySelector('#detailed-price');

            detailedImage.src = books[bookId].image;
            detailedImage.alt = books[bookId].title;
            detailedTitle.textContent = books[bookId].title;
            detailedDescription.textContent = books[bookId].description;
            detailedAuthor.textContent = books[bookId].author;
            detailedPrice.textContent = `$${books[bookId].price.toFixed(2)}`;

            // Update the add to cart button with the book information
            const addToCartButton = document.querySelector('#add-to-cart-button');
            addToCartButton.dataset.bookId = bookId;
            addToCartButton.dataset.bookTitle = bookTitle;
            addToCartButton.dataset.bookPrice = bookPrice;
        }

        function backToRegularView() {
            // Hide the detailed view
            const detailedView = document.querySelector('#detailed-view');
            detailedView.classList.add('d-none');

            // Show the regular view
            const regularView = document.querySelector('.bookstore');
            regularView.classList.remove('d-none');
        }

        function renderBooks(booksData) {
            let output = `<div class="row mb-4">
        <div class="col-md-4">
          <select class="form-select filter-select" aria-label="Filter by Category">
            <option selected>Filter by Category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </select>
        </div>
        <div class="col-md-4">
          <select class="form-select filter-select" aria-label="Filter by Author">
            <option selected>Filter by Author</option>
            <option value="author1">Author 1</option>
            <option value="author2">Author 2</option>
            <option value="author3">Author 3</option>
          </select>
        </div>
        <div class="col-md-4">
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input type="number" class="form-control" placeholder="Min Price">
            <span class="input-group-text">-</span>
            <input type="number" class="form-control" placeholder="Max Price">
          </div>
        </div>
      </div>
      
      <div class="row mb-4">
      <div class="col-md-12">
        <label for="sort-dropdown" class="form-label">Sort By:</label>
        <select class="form-select" id="sort-dropdown">
          <option value="title-asc">Title (Ascending)</option>
          <option value="title-desc">Title (Descending)</option>
          <option value="price-asc">Price (Ascending)</option>
          <option value="price-desc">Price (Descending)</option>
          <option value="author-asc">Author (Ascending)</option>
          <option value="author-desc">Author (Descending)</option>
        </select>
      </div>
    </div>
    
      `;


            booksData.forEach(book => {
                // create the HTML code for each book card
                output += `
                <div class="card mb-3" style="position: relative; z-index: 1;">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <img src="${book.image}" alt="${book.title}">
                    </div>
                    <div class="col-md-8">
                      <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text"><small class="text-muted">${book.author}</small></p>
                        <button class="btn btn-primary view-details" data-book-id="${book.id}" data-book-title="${book.title}" data-book-price="${book.price}">View Details</button>
                        <button class="btn btn-success add-to-cart" data-book-id="${book.id}" data-book-title="${book.title}" data-book-price="${book.price}">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            });



            // update the HTML of the bookstore container with the new output
            bookstore.innerHTML = output;

            const sortDropdown = document.querySelector('#sort-dropdown');
            sortDropdown.addEventListener('change', () => {
                const sortOption = sortDropdown.value;
                let sortedBooks = books.slice(); // Create a copy of the books array to sort

                if (sortOption === 'title-asc') {
                    sortedBooks.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
                } else if (sortOption === 'title-desc') {
                    sortedBooks.sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: 'base' }));
                } else if (sortOption === 'price-asc') {
                    sortedBooks.sort((a, b) => a.price - b.price);
                } else if (sortOption === 'price-desc') {
                    sortedBooks.sort((a, b) => b.price - a.price);
                } else if (sortOption === 'author-asc') {
                    sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
                } else if (sortOption === 'author-desc') {
                    sortedBooks.sort((a, b) => b.author.localeCompare(a.author));
                }

                // Render the sorted books
                renderBooks(sortedBooks);

                // Update the selected option in the sort dropdown
    const sortOptionElement = document.querySelector(`#sort-dropdown option[value="${sortOption}"]`);
    sortOptionElement.selected = true;
            });

            // re-add event listeners to the "Add to Cart" buttons
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', addToCart);
            });

            // re-add event listeners to the "View Details" buttons
            const viewDetailsButtons = document.querySelectorAll('.view-details');
            viewDetailsButtons.forEach(button => {
                button.addEventListener('click', viewDetails);
            });
        }


        const backButton = document.querySelector('#back-button');
        backButton.addEventListener('click', backToRegularView);
        const sortDropdown = document.querySelector('#sort-dropdown');
        sortDropdown.addEventListener('change', () => {
            const sortOption = sortDropdown.value;
            let sortedBooks = books.slice(); // Create a copy of the books array to sort

            if (sortOption === 'title-asc') {
                sortedBooks.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
            } else if (sortOption === 'title-desc') {
                sortedBooks.sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: 'base' }));
            } else if (sortOption === 'price-asc') {
                sortedBooks.sort((a, b) => a.price - b.price);
            } else if (sortOption === 'price-desc') {
                sortedBooks.sort((a, b) => b.price - a.price);
            } else if (sortOption === 'author-asc') {
                sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
            } else if (sortOption === 'author-desc') {
                sortedBooks.sort((a, b) => b.author.localeCompare(a.author));
            }

            // Render the sorted books
            renderBooks(sortedBooks);
            // Update the selected option in the sort dropdown
    const sortOptionElement = document.querySelector(`#sort-dropdown option[value="${sortOption}"]`);
    sortOptionElement.selected = true;
        });
    })
    .catch(err => console.error(err)); 