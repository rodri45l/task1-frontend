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
        let output = `
    
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
            const book = books.find(book => book.id === parseInt(bookId));
            const bookTitle = book.title;
            const bookPrice = parseFloat(book.price);
        
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
        
            detailedImage.src = book.image;
            detailedImage.alt = book.title;
            detailedTitle.textContent = book.title;
            detailedDescription.textContent = book.description;
            detailedAuthor.textContent = book.author;
            detailedPrice.textContent = `$${book.price.toFixed(2)}`;
        
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
            let output = `
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

        fetch("books.json")
            .then(response => response.json())
            .then(data => {
                // get categories and authors
                categories = [...new Set(data.map(book => book.category))];
                authors = [...new Set(data.map(book => book.author))];


                const categorySelect = document.querySelector('#categories-dropdown');
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.toLowerCase().replace(/ /g, '-');
                    option.text = category;
                    categorySelect.add(option);
                });

                // add authors to the author filter dropdown
                const authorSelect = document.querySelector('#authors-dropdown');
                authors.forEach(author => {
                    const option = document.createElement('option');
                    option.value = author.toLowerCase()
                    option.text = author;
                    authorSelect.add(option);
                });


                const minPriceInput = document.querySelector('#min-price');
                const maxPriceInput = document.querySelector('#max-price');

                categorySelect.addEventListener('change', handleFilterChange);
                authorSelect.addEventListener('change', handleFilterChange);
                minPriceInput.addEventListener('change', handleFilterChange);
                maxPriceInput.addEventListener('change', handleFilterChange);

                function handleFilterChange() {
                    const selectedCategory = categorySelect.value;
                    const selectedAuthor = authorSelect.value;
                    const minPrice = minPriceInput.value !== '' ? Number(minPriceInput.value) : -Infinity;
                    const maxPrice = maxPriceInput.value !== '' ? Number(maxPriceInput.value) : Infinity;

                    const filteredBooks = books.filter(book => {

                        
                        if (selectedCategory !== 'Filter by Category' && book.category.toLowerCase() !== selectedCategory.toLowerCase()) {
                            
                            return false;
                        }

                        if (selectedAuthor !== 'Filter by Author' && book.author.toLowerCase() !== selectedAuthor.toLowerCase()) {

                            
                            return false;
                        }

                        if (book.price < minPrice || book.price > maxPrice) {
                            return false;
                        }

                        return true;
                    });

                    console.log(filteredBooks)

                    renderBooks(filteredBooks);
                }


            })
            .catch(error => console.error(error));
    })
    .catch(err => console.error(err));










