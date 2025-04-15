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

document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = document.getElementById("cart-count");
    const cartIcon = document.getElementById("cart-icon");

    // Create a cart popup element
    let cartPopup = document.querySelector(".cart-popup");
    if (!cartPopup) {
        cartPopup = document.createElement("div");
        cartPopup.className = "cart-popup";
        cartPopup.style.display = "none";
        document.body.appendChild(cartPopup);
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Update Cart Count
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        saveCart();
    }

    // Show temporary popup message
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

        return tempPopup;
    }

    // Handle Add to Cart buttons
    document.querySelectorAll("#add-to-cart").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const name = btn.getAttribute("data-name");
            const price = parseFloat(btn.getAttribute("data-price"));

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
                buyBtn.addEventListener('click', () => {
                    if (cart.length === 0) {
                        showTemporaryPopup('Your cart is empty!');
                        return;
                    }
                    // Redirect to checkout page
                    window.location.href = "checkout.html";
                });
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
                        cart.splice(index, 1);
                    }
                    updateCartCount();
                    displayCartPopup();
                })
            );

            cartPopup.querySelectorAll(".remove-btn").forEach((btn) =>
                btn.addEventListener("click", (e) => {
                    const index = parseInt(btn.getAttribute("data-index"), 10);
                    cart.splice(index, 1);
                    updateCartCount();
                    displayCartPopup();
                })
            );
        }

        cartPopup.style.display = "block";
    }

    // Clear Cart Functionality
    function clearCart() {
        if (cart.length === 0) {
            showTemporaryPopup('Your cart is already empty!');
            return false;
        }

        if (confirm('Are you sure you want to clear your cart?')) {
            while (cart.length > 0) {
                cart.pop();
            }
            updateCartCount();
            displayCartPopup();
            showTemporaryPopup('Cart cleared successfully!');
            return true;
        }
        return false;
    }

    // Checkout page functionality
    if (window.location.pathname.endsWith("checkout.html")) {
        populateOrderSummary();
        const checkoutForm = document.getElementById("checkout-form");
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            // Simple form validation can be added here

            // Simulate purchase processing
            alert("Thank you for your purchase!");
            // Clear cart after purchase
            while (cart.length > 0) {
                cart.pop();
            }
            updateCartCount();
            // Redirect to home or confirmation page
            window.location.href = "cardealership.html";
        });
    }

    // Populate order summary in checkout.html
    function populateOrderSummary() {
        const orderItemsContainer = document.getElementById("order-items");
        const subtotalElem = document.getElementById("subtotal");
        const taxElem = document.getElementById("tax");
        const grandTotalElem = document.getElementById("grand-total");

        if (!orderItemsContainer || !subtotalElem || !taxElem || !grandTotalElem) {
            return;
        }

        if (cart.length === 0) {
            orderItemsContainer.innerHTML = "<p>Your cart is empty!</p>";
            subtotalElem.textContent = "$0.00";
            taxElem.textContent = "$0.00";
            grandTotalElem.textContent = "$0.00";
            return;
        }

        const taxRate = 0.1; // 10% tax for example
        let subtotal = 0;

        const itemsHtml = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            return `<div class="order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${itemTotal.toFixed(2)}</span>
                    </div>`;
        }).join("");

        const tax = subtotal * taxRate;
        const grandTotal = subtotal + tax;

        orderItemsContainer.innerHTML = itemsHtml;
        subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
        taxElem.textContent = `$${tax.toFixed(2)}`;
        grandTotalElem.textContent = `$${grandTotal.toFixed(2)}`;
    }

    updateCartCount();
    // Remove the automatic display of the cart popup on page load
    // displayCartPopup();

    // Cart icon click toggles popup
    cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        if (cartPopup.style.display === "none" || cartPopup.style.display === "") {
            displayCartPopup();
        } else {
            cartPopup.style.display = "none";
        }
    });
});

// Chat bot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatBubble = document.getElementById('chatBubble');

window.openMatchFinder = function() {
  document.getElementById('matchFinderPopup').style.display = 'block';
};

window.closeMatchFinder = function() {
  document.getElementById('matchFinderPopup').style.display = 'none';
};

document.getElementById("matchQuizForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const form = e.target;
  const brand = form.querySelector('select:nth-of-type(1)').value;
  const budget = form.querySelector('select:nth-of-type(2)').value;
  const carType = form.querySelector('select:nth-of-type(3)').value;
  
  console.log("Match Finder Form Submitted");
  console.log("Brand:", brand, "Budget:", budget, "Car Type:", carType);
  
  // Match logic based on selections
  let matchedCar = findMatchingCar(brand, budget, carType);
  
  console.log("Matched Car:", matchedCar);
  
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
        'cart': 'You can view your cart by clicking the cart icon in the navigation bar. Your current cart count is displayed next to the icon.',
        'electric vehicles': 'We offer a range of electric vehicles including the Porsche Taycan. They are eco-friendly and high performance.',
        'luxury cars': 'Our luxury car selection includes brands like BMW, Audi, and Lamborghini. Would you like to know more about a specific model?',
        'suv': 'We have several SUVs including the BMW XM. They offer spacious interiors and powerful performance.',
        'sports cars': 'Our sports car lineup features the Dodge Demon and Lamborghini Aventador, perfect for high performance enthusiasts.',
        'maintenance': 'Regular maintenance is important. Our service department offers oil changes, tire rotations, brake inspections, and more.',
        'financing options': 'We provide flexible financing options with competitive rates. You can apply online or speak with a finance specialist.',
        'trade-in process': 'Our trade-in process is simple. Bring your vehicle for an appraisal and get a fair market offer.',
        'special offers': 'Check our website regularly for special offers and discounts on select vehicles and services.',
        'customer support': 'Our customer support team is available Monday to Friday from 9am to 6pm. Contact us via phone or email for assistance.',
        'test drive scheduling': 'You can schedule a test drive online or by calling our dealership during business hours.',
        'extended warranty': 'We offer extended warranty plans for added peace of mind. Ask our sales team for details.',
        'accessories': 'We have a variety of vehicle accessories including floor mats, roof racks, and custom wheels. Visit our Parts section.',
        'trade-in value': 'To get an estimate of your trade-in value, please provide your vehicle details to our appraisal team.',
        'delivery options': 'We offer home delivery and dealership pickup options for your convenience.',
        'insurance': 'We can assist you with vehicle insurance options through our trusted partners.',
        'roadside assistance': 'Our roadside assistance program is available 24/7 for emergencies and breakdowns.',
        'loyalty program': 'Join our loyalty program to earn rewards and discounts on future purchases and services.',
        'service appointment': 'Schedule your vehicle service appointment online or by contacting our service department.',
        'vehicle history': 'We provide detailed vehicle history reports for all pre-owned vehicles in our inventory.',
        'trade-in appraisal': 'Our experts will appraise your trade-in vehicle quickly and fairly during your visit.',
        'contact sales': 'You can contact our sales team directly via phone or email for personalized assistance.',
        'online chat': 'Use our online chat feature for instant answers to your questions during business hours.',
        'test drive availability': 'Test drives are available by appointment. Please schedule in advance to ensure availability.',
        'vehicle customization': 'We offer customization options including paint, wheels, and interior upgrades. Ask our sales team for details.',
        'return policy': 'Please refer to our return policy on the website or contact customer service for more information.',
        'privacy policy': 'Our privacy policy explains how we protect your personal information. It is available on our website.',
        'terms and conditions': 'Review our terms and conditions for sales and services on our website.',
        'careers': 'Interested in joining Xmotors? Check our Careers page for current job openings and application details.',
        'events': 'We host events and promotions throughout the year. Check our website or subscribe to our newsletter for updates.',
        'newsletter': 'Subscribe to our newsletter to receive the latest news, offers, and updates from Xmotors.',
        'feedback': 'We value your feedback. Please use the Contact Us page to send us your comments and suggestions.',
        'hours of operation': 'Our hours of operation are Monday to Friday 9am-8pm, Saturday 9am-6pm, and Sunday 11am-5pm.',
        'directions': 'For directions to Xmotors, please visit our Contact page or use your preferred map application.',
        'payment methods': 'We accept various payment methods including cash, credit cards, and financing options.',
        'vehicle availability': 'Check our inventory online or contact us to confirm the availability of specific vehicles.',
        'service specials': 'We offer service specials and discounts. Check our website or contact the service department for details.',
        'gift cards': 'Gift cards are available for purchase and can be used towards vehicles, services, and parts.',
        'vehicle recalls': 'We monitor vehicle recalls and notify customers. Contact us if you have concerns about your vehicle.',
        'test drive requirements': 'A valid driver\'s license and insurance are required to take a test drive at Xmotors.',
        'vehicle trade-in': 'Trade-in your current vehicle towards the purchase of a new or pre-owned vehicle at Xmotors.',
        'extended service plans': 'Extended service plans are available for additional coverage beyond the manufacturer warranty.',
        'vehicle financing application': 'Apply for vehicle financing online or in person with our finance specialists.',
        'contact information': 'You can contact us at info@xmotors.com or call +1-800-555-1234 for general inquiries.'
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
