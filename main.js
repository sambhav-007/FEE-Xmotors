const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.textContent = "↑";
scrollToTopBtn.classList.add("scroll-to-top");
document.body.appendChild(scrollToTopBtn);

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
});

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// const links = document.querySelectorAll('a');
// const loader = document.getElementById('loader');

// function showLoaderAndRedirect(event, url) {
//     event.preventDefault(); 
//     loader.style.display = 'flex'; 

//     setTimeout(() => {
//         window.location.href = url; 
//     }, 1500); 
// }

// links.forEach(link => {
//     if (link.href) {
//         link.addEventListener('click', (event) => {
//             showLoaderAndRedirect(event, link.href);
//         });
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
    const cart = [];
    const cartCount = document.getElementById("cart-count");
    const cartIcon = document.getElementById("cart-icon");

    // Create a cart popup element
    const cartPopup = document.createElement("div");
    cartPopup.className = "cart-popup";
    cartPopup.style.display = "none";
    document.body.appendChild(cartPopup);

    // Handle Add to Cart
    document.querySelectorAll("#add-to-cart").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

            const name = btn.getAttribute("data-name");
            const price = parseFloat(btn.getAttribute("data-price"));

            // Check if the item already exists in the cart
            const existingItem = cart.find((item) => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1; 
            } else {
                cart.push({ name, price, quantity: 1 }); 
            }
            updateCartCount();
            displayCartPopup();
            showTemporaryPopup(`${name} added to the cart!`);
        });
    });

    // Update Cart Count
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // Toggle Cart Popup
    cartIcon.addEventListener("click", (e) => {
        e.preventDefault();

        if (cartPopup.style.display === "none") {
            displayCartPopup();
        } else {
            cartPopup.style.display = "none"; // Close the popup
        }
    });

    // Display Cart Popup with Items
    function displayCartPopup() {
        if (cart.length === 0) {
            cartPopup.innerHTML = "<p>Your cart is empty!</p>";
        } else {
            const cartItems = cart
                .map(
                    (item, index) =>
                        `<div class="cart-item">
                            <p>${item.name} - $${item.price.toFixed(2)}</p>
                            <div class="cart-controls">
                                <button class="decrease-btn" data-index="${index}">-</button>
                                <span>${item.quantity}</span>
                                <button class="increase-btn" data-index="${index}">+</button>
                                <button class="remove-btn" data-index="${index}">X</button>
                            </div>
                        </div>`
                )
                .join("");

            const totalPrice = cart.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            cartPopup.innerHTML = `
                <h4>Your Cart:</h4>
                ${cartItems}
                <hr>
                <p>Total: $${totalPrice.toFixed(2)}</p>
                <div class="cart-actions">
                    <button class="buy-now-btn">Buy Now</button>
                    <button class="clear-cart-btn">Clear Cart</button>
                    
                </div>
            `;

            // Add event listeners for new buttons
            const clearBtn = cartPopup.querySelector('.clear-cart-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', clearCart);
            }
            
            const buyBtn = cartPopup.querySelector('.buy-now-btn');
            if (buyBtn) {
                buyBtn.addEventListener('click', buyNow);
            }

            // Add event listeners for controls
            cartPopup.querySelectorAll(".increase-btn").forEach((btn) =>
                btn.addEventListener("click", (e) => {
                    const index = parseInt(btn.getAttribute("data-index"), 10);
                    cart[index].quantity += 1;
                    updateCartCount();
                    displayCartPopup();
                })
            );

            cartPopup.querySelectorAll(".decrease-btn").forEach((btn) =>
                btn.addEventListener("click", (e) => {
                    const index = parseInt(btn.getAttribute("data-index"), 10);
                    if (cart[index].quantity > 1) {
                        cart[index].quantity -= 1;
                    } else {
                        cart.splice(index, 1); // Remove item if quantity reaches 0
                    }
                    updateCartCount();
                    displayCartPopup();
                })
            );

            cartPopup.querySelectorAll(".remove-btn").forEach((btn) =>
                btn.addEventListener("click", (e) => {
                    const index = parseInt(btn.getAttribute("data-index"), 10);
                    cart.splice(index, 1); // Remove item
                    updateCartCount();
                    displayCartPopup();
                })
            );
        }

        cartPopup.style.display = "block"; // Show the popup
    }

    // Clear Cart Functionality
    function clearCart() {
        if (cart.length === 0) {
            showTemporaryPopup('Your cart is already empty!');
            return false;
        }
        
        if (confirm('Are you sure you want to clear your cart?')) {
            while(cart.length > 0) {
                cart.pop();
            }
            updateCartCount();
            displayCartPopup();
            showTemporaryPopup('Cart cleared successfully!');
            return true;
        }
        return false;
    }

    //Buy Now Functionality
    function buyNow() {
        if (cart.length === 0) {
            showTemporaryPopup('Your cart is empty!');
            return false;
        }

        // Show loading state
        const loadingPopup = showTemporaryPopup('Processing your purchase...', 0);
        
        // Simulate API call delay
        setTimeout(() => {
            try {
                // Calculate total
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                // Generate order summary
                const orderItems = cart.map(item => 
                    `${item.quantity}x ${item.name} - $${item.price.toFixed(2)}`
                ).join('\n');
                
                // Remove loading popup
                loadingPopup.remove();
                
                // Show success message with order details
                showTemporaryPopup(
                    `Order Confirmed!\n\nItems:\n${orderItems}\n\nTotal: $${total.toFixed(2)}\nThank you for your purchase!`,
                    5000
                );
                
                // Clear cart
                clearCart();
                
                return true;
            } catch (error) {
                loadingPopup.remove();
                showTemporaryPopup('Purchase failed. Please try again.', 3000);
                return false;
            }
        }, 2000);
    }

    // Updated Temporary Popup Message with duration parameter
    function showTemporaryPopup(message, duration = 2000) {
        const tempPopup = document.createElement("div");
        tempPopup.className = "temporary-popup";
        tempPopup.textContent = message;

        document.body.appendChild(tempPopup);

        if (duration > 0) {
            setTimeout(() => {
                tempPopup.remove();
            }, duration);
        }
        
        return tempPopup; // Return reference for removal
    }

});

document.addEventListener('DOMContentLoaded', function() {
    const chatBubble = document.getElementById('chatBubble');
    const chatContainer = document.getElementById('chatContainer');
    const chatHeader = document.getElementById('chatHeader');
    const closeChat = document.getElementById('closeChat');
    const chatBody = document.getElementById('chatBody');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');

    const knowledgeBase = {
    'hello': 'Welcome to Xmotors! Ready to explore your dream car? Let me know how I can help.',
    'hi': 'Hi there! Looking for luxury, performance, or electric? I’m here to assist.',
    'hours': 'We’re open Monday to Saturday from 9 AM to 7 PM, and Sunday from 10 AM to 5 PM.',
    'location': 'You’ll find us right in the heart of the city! Visit our Contact page for directions.',
    'inventory': 'Explore top-tier models like Porsche Taycan, Audi e-tron GT, Ferrari SF90, and more in our Cars section.',
    'financing': 'Yes! We offer flexible financing with competitive rates. Want to speak with our finance team?',
    'test drive': 'Absolutely! Schedule a test drive through our Test Drive section or walk in during open hours.',
    'trade in': 'Thinking of trading in? We offer great value! Let’s get your car evaluated.',
    'warranty': 'All new cars come with manufacturer warranty. Extended plans available too!',
    'service': 'Our certified techs keep your car running perfectly. See our Service section for details.',
    'parts': 'Need genuine parts? Check our Parts section for engines, tyres, alternators, and more.',
    'specials': 'Stay tuned for exclusive offers and seasonal promotions on our homepage!',
    'price': 'Prices depend on the model and config. Tell me the car you're eyeing, and I’ll get the details.',
    'appointment': 'Want to meet an expert or visit us? I can help set up an appointment.',
    'used cars': 'We stock high-quality certified pre-owned vehicles. Want to browse options?',
    'new cars': 'From luxury to electric, our latest lineup is top-tier. Looking for a specific brand?',
    'porsche': 'We’ve got the Porsche Taycan ready for you! Want to check out its details?',
    'audi': 'Audi e-tron GT is one of our highlights. Interested in a test drive?',
    'mercedes': 'Check out the Mercedes EQS and AMG GT in our showroom.',
    'bmw': 'Looking for BMW i7, iX, or M Series? Let me guide you there.',
    'tesla': 'We also feature Tesla Model S, 3, X, and Y. Want to know more?',
    'engine': 'Our premium engines start at $39,000. Head to the Parts section for full info.',
    'gear': 'Gear boxes available from $399.99. See the Parts section for more.',
    'spare parts': 'Genuine spare parts start at $299. View all in the Parts section.',
    'air filter': 'We offer high-performance air filters from $299 in our Parts shop.',
    'alternator': 'Alternators start at $999. Visit the Parts section to learn more.',
    'tyre': 'MRF tyres available starting at $399. Check them out in Parts.',
    'contact': 'Reach out through our Contact page, phone, or live chat for support.',
    'register': 'Click the "Register" button in the top right to create your account.',
    'login': 'Use the "Login" button in the header to access your account anytime.',
    'blog': 'Get car insights, reviews, and tips in our Blog section.',
    'cart': 'View your selected items by clicking the cart icon in the top menu.'
};

    chatBubble.addEventListener('click', function() {
        chatBubble.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        chatInput.focus();
    });

    closeChat.addEventListener('click', function() {
        chatContainer.classList.add('hidden');
        chatBubble.classList.remove('hidden');
    });

    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        addMessage(message, 'user');
        chatInput.value = '';

        showTypingIndicator();

        setTimeout(() => {
            const response = getBotResponse(message);
            removeTypingIndicator();
            addMessage(response, 'bot');
        }, 1500);
    }

    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.classList.add(sender + '-message');

        const emojiSpan = document.createElement('span');
        emojiSpan.classList.add('message-emoji');
        emojiSpan.textContent = '🚗';
        
        messageElement.appendChild(emojiSpan);
        messageElement.appendChild(document.createTextNode(message));
        
        chatBody.appendChild(messageElement);
        
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.id = 'typingIndicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            indicator.appendChild(dot);
        }
        
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function getBotResponse(userInput) {

        const input = userInput.toLowerCase();
        
        if (knowledgeBase[input]) {
            return knowledgeBase[input];
        }
        
        for (const key in knowledgeBase) {
            if (input.includes(key)) {
                return knowledgeBase[key];
            }
        }
        
        if (input.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with regarding Xmotors vehicles or services?";
        } else if (input.includes('bye') || input.includes('goodbye')) {
            return "Thank you for chatting with Xmotors. Feel free to reach out if you have any more questions. Have a great day!";
        } else if (input.includes('help')) {
            return "I can help with information about our vehicle inventory, business hours, financing options, test drives, and more. What would you like to know about Xmotors?";
        } else {
            return "I'm not sure I understand. Could you rephrase or ask about our vehicles, parts, financing, business hours, or schedule a test drive at Xmotors?";
        }
    }
});


  // Match Finder Functions
  function openMatchFinder() {
    document.getElementById('matchFinderPopup').style.display = 'block';
  }

  function closeMatchFinder() {
    document.getElementById('matchFinderPopup').style.display = 'none';
  }

  document.getElementById("matchQuizForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const form = e.target;
    const brand = form.querySelector('select:nth-of-type(1)').value;
    const budget = form.querySelector('select:nth-of-type(2)').value;
    const carType = form.querySelector('select:nth-of-type(3)').value;
    
    // Match logic based on selections
    let matchedCar = findMatchingCar(brand, budget, carType);
    
    if (matchedCar) {
      // Show match result
      const matchContent = document.querySelector('.match-content');
      matchContent.innerHTML = `
        <span class="close-btn" onclick="closeMatchFinder()">&times;</span>
        <h2>Your Perfect Match!</h2>
        <div style="text-align: center; margin: 20px 0;">
          <img src="img/${matchedCar.image}" alt="${matchedCar.name}" style="max-width: 100%; border-radius: 10px;">
          <h3>${matchedCar.name}</h3>
          <p>This ${matchedCar.type} matches your preferences for ${brand} in the ${budget} range.</p>
          <div style="margin-top: 20px;">
            <a href="${matchedCar.link}" class="btn" style="margin: 0 15px;">View Details</a>
            <a href="#test-drive" class="btn" style="margin: 0 15px;" onclick="closeMatchFinder()">Book Test Drive</a>
          </div>
        </div>
      `;
    } else {
      // No match found
      const matchContent = document.querySelector('.match-content');
      matchContent.innerHTML = `
        <span class="close-btn" onclick="closeMatchFinder()">&times;</span>
        <h2>No Exact Match Found</h2>
        <p>We couldn't find a perfect match based on your criteria.</p>
        <p>Our team can help you find alternatives - please contact us or check our full inventory.</p>
        <div style="margin-top: 20px;">
          <a href="#cars" class="btn" onclick="closeMatchFinder()">View All Cars</a>
        </div>
      `;
    }
  });

  function findMatchingCar(brand, budget, carType) {
    // Car database - would normally come from backend
    const cars = [
      {
        name: "PORSCHE TAYCAN",
        brand: "Porsche",
        type: "Electric",
        budget: "₹1-10 crore",
        image: "car1.jpg",
        link: "porshetaycan.html"
      },
      {
        name: "AUDI e-tron GT",
        brand: "Audi",
        type: "Electric",
        budget: "Below ₹1 crore",
        image: "car2.jpg",
        link: "audietronGT.html"
      },
      {
        name: "BUGATTI TOURBILLON",
        brand: "Buggati",
        type: "Sports",
        budget: "Above ₹10 crore",
        image: "car3.jpg",
        link: "buggatitourbillon.html"
      },
      {
        name: "REVUELTO",
        brand: "Lamborghini",
        type: "Sports",
        budget: "₹1-10 crore",
        image: "car4.jpg",
        link: "reveulto.html"
      },
      {
        name: "KOENIGSEGG REGERA",
        brand: "Koenigsegg",
        type: "Sports",
        budget: "Above ₹10 crore",
        image: "car5.jpg",
        link: "koenigsegg.html"
      },
      {
        name: "MASERATI GRANTURISMO",
        brand: "Maserati",
        type: "Sports",
        budget: "₹1-10 crore",
        image: "car6.jpg",
        link: "maserati.html"
      },
      {
        name: "FERRARI SF90",
        brand: "Ferrari",
        type: "Sports",
        budget: "₹1-10 crore",
        image: "car7.jpg",
        link: "ferrari.html"
      },
      {
        name: "MCLAREN 720S",
        brand: "mclaren",
        type: "Sports",
        budget: "₹1-10 crore",
        image: "car8.jpg",
        link: "mclaren.html"
      }
    ];

    // Filter cars based on selections
    const matches = cars.filter(car => {
      const brandMatch = brand === "Select one" || car.brand.toLowerCase() === brand.toLowerCase();
      const budgetMatch = budget === "Select range" || car.budget === budget;
      const typeMatch = carType === "Select type" || car.type.toLowerCase() === carType.toLowerCase();
      return brandMatch && budgetMatch && typeMatch;
    });

    // Handle special cases when only budget is selected
    if (matches.length === 0 && brand === "Select one" && carType === "Select type" && budget !== "Select range") {
      // Return specific representative car for each budget range
      if (budget === "Below ₹1 crore") {
        // Ensure we return Audi e-tron GT (not Porsche Taycan) for this range
        const audi = cars.find(car => car.name === "AUDI e-tron GT" && car.budget === "Below ₹1 crore");
        return audi || null;
      } else if (budget === "₹1-10 crore") {
        return cars.find(car => car.name === "MASERATI GRANTURISMO" && car.budget === "₹1-10 crore") || null;
      } else if (budget === "Above ₹10 crore") {
        return cars.find(car => car.name === "BUGATTI TOURBILLON" && car.budget === "Above ₹10 crore") || null;
      }
    }

    // For all other cases, return first match or null
    return matches.length > 0 ? matches[0] : null;
  }


