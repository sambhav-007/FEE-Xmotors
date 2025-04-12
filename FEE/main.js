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
            `;

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

    // Temporary Popup Message
    function showTemporaryPopup(message) {
        const tempPopup = document.createElement("div");
        tempPopup.className = "temporary-popup";
        tempPopup.textContent = message;

        document.body.appendChild(tempPopup);

        setTimeout(() => {
            tempPopup.remove();
        }, 2000); // Temporary popup disappears after 2 seconds
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
        'hello': 'Hello! Welcome to Xmotors. How can I assist you with our vehicles today?',
        'hi': 'Hi there! How can I help you find your perfect car at Xmotors?',
        'hours': 'Our dealership is open Monday to Friday from 9am to 8pm, Saturday from 9am to 6pm, and Sunday from 11am to 5pm.',
        'location': 'Xmotors is located at your service. For exact directions, please contact our team at the numbers listed in the footer section.',
        'inventory': 'We have a wide range of luxury and performance vehicles including Porsche Taycan, Audi A4, Bugatti Bolide, Lamborghini Aventador, BMW XM, and Dodge Demon. You can view them in our Cars section.',
        'financing': 'We offer competitive financing options and can work with various credit situations. Would you like to speak with one of our finance specialists?',
        'test drive': 'Yes, we offer test drives! You can schedule one online or drop by our Xmotors dealership during business hours.',
        'trade in': 'We accept trade-ins and offer fair market value for your vehicle. Would you like to get an estimate?',
        'warranty': 'All new vehicles come with a manufacturer warranty, and we offer extended warranty options for both new and used vehicles.',
        'service': 'Our service department provides top-notch maintenance by expert technicians as mentioned in our About section.',
        'parts': 'Our parts department offers quality components like engines, gear boxes, spare parts, air filters, alternators, and MRF tyres. Check our Parts section for more details.',
        'specials': 'We regularly update our specials and promotions. Check our website for the latest offers.',
        'price': 'Our prices vary depending on the model, year, and features. Can you tell me which vehicle you are interested in?',
        'appointment': 'Would you like to schedule an appointment with a sales representative? I can help you set that up.',
        'used cars': 'At Xmotors, we have a selection of pre-owned vehicles. All undergo a thorough inspection before sale.',
        'new cars': 'We carry the latest models with various trim levels and options. Is there a specific model you are looking for?',
        'porsche': 'We have the Porsche Taycan available. Would you like more information about this electric performance car?',
        'audi': 'We have the Audi A4 in our inventory. It\'s a premium sedan with excellent features and performance.',
        'bugatti': 'The Bugatti Bolide is one of our high-performance luxury vehicles. Would you like to know more about its specifications?',
        'lamborghini': 'The Lamborghini Aventador is available at Xmotors. It\'s a supercar with impressive performance capabilities.',
        'bmw': 'We have the BMW XM in our inventory. It\'s a luxury performance SUV with advanced features.',
        'dodge': 'The Dodge Demon is available at Xmotors. It\'s a high-performance muscle car with impressive power.',
        'engine': 'We offer high-quality engines for ₹32.37 lakh. You can find them in our Parts section.',
        'gear': 'We have gear boxes available for ₹33,199. Check out our Parts section for more information.',
        'spare parts': 'We offer auto spare parts ranging from ₹8,299 to ₹24,899. You can find them in our Parts section.',
        'air filter': 'We have air filters available for ₹24,899. Check out our Parts section for more details.',
        'alternator': 'We offer car alternators for ₹82,999. You can find them in our Parts section.',
        'tyre': 'We have MRF tyres available for ₹33,199. Check out our Parts section for more information.',
        'contact': 'You can reach our team members: Shivansh Chandel: +91 7340900212, Sambhav Sehgal: +91 7988280245, or Shivansh Pathania: +91 6230650034.',
        'register': 'You can register on our website by clicking the Register link in the top navigation bar.',
        'login': 'You can log in to your account by clicking the Login link in the top navigation bar.',
        'blog': 'Check out our blog by clicking the Blog link in the navigation menu for the latest news and updates from Xmotors.',
        'cart': 'You can view your cart by clicking the cart icon in the navigation bar. Your current cart count is displayed next to the icon.'
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


  function openMatchFinder() {
    document.getElementById('matchFinderPopup').style.display = 'block';
  }

  function closeMatchFinder() {
    document.getElementById('matchFinderPopup').style.display = 'none';
  }

  document.getElementById("matchQuizForm").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("🚘 We'll show your best match shortly!");
    closeMatchFinder();
  });


