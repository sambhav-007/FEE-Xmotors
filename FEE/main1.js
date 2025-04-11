document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;

        answer.classList.toggle('open');

        document.querySelectorAll('.faq-answer').forEach(otherAnswer => {
            if (otherAnswer !== answer) {
                otherAnswer.classList.remove('open');
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("apply-now-popup");
    const closeBtn = document.querySelector(".close-btn");
    const applyForm = document.getElementById("apply-form");

    const hasApplied = localStorage.getItem("hasApplied");

    if (!hasApplied) {
        setTimeout(() => {
            popup.style.display = "flex";
        }, 5000);
    }

    closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });

    applyForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        alert("Thank you for applying!");
        popup.style.display = "none";

        localStorage.setItem("hasApplied", "true");
    });
});

// Articles content data
const articles = {
    1: {
        title: "NEET 2024 Exam Date Announced",
        content: "The National Testing Agency has announced the NEET 2024 exam date. Make sure you’re ready for the test with proper preparation and planning. Here’s everything you need to know about the NEET 2024 exam schedule, eligibility criteria, and exam centers."
    },
    2: {
        title: "Top Tips for Cracking MBBS Admissions",
        content: "To get into the best medical colleges, you need more than just good marks. Explore top tips for cracking MBBS admissions including study strategies, time management, and resources for success."
    },
    3: {
        title: "How to Choose the Best Medical College",
        content: "Choosing a medical college is one of the most important decisions in your MBBS journey. Here are factors to consider when selecting a medical college, including infrastructure, faculty, placement records, and location."
    },
    4: {
        title: "Important Documents for NEET Application",
        content: "Before you apply for NEET 2024, ensure you have the necessary documents ready. Learn about the important documents you need, including your ID proof, photographs, educational certificates, and more."
    },
    5: {
        title: "Latest Trends in Medical Education",
        content: "Medical education is constantly evolving. Learn about the latest trends in medical education, including the integration of technology, remote learning opportunities, and innovative teaching methods."
    },
    6: {
        title: "What to Expect from MBBS Curriculum",
        content: "The MBBS curriculum is rigorous and diverse. Here’s what you can expect during your journey through medical school, from theoretical knowledge to practical experience in hospitals and clinics."
    },
    7: {
        title: "Top Specializations in Medicine",
        content: "Choosing a specialization in medicine is crucial for your career. Explore the top medical specializations such as cardiology, neurology, and orthopedics, and find out which path suits you best."
    },
    8: {
        title: "Scholarships for Medical Students in 2024",
        content: "In 2024, many scholarships are available for aspiring medical students. Learn about the most popular scholarships in India and abroad, how to apply, and the eligibility criteria for each."
    }
};

// Show Modal Content when clicking on an article
document.querySelectorAll('.news-item').forEach(item => {
    item.addEventListener('click', function() {
        const articleId = this.getAttribute('data-article');
        const article = articles[articleId];
        
        // Set modal title and content
        document.getElementById('modal-title').textContent = article.title;
        document.getElementById('modal-description').innerHTML = `<p>${article.content}</p>`;
        
        // Show the modal
        document.getElementById('article-modal').style.display = 'flex';
    });
});

// Close the modal when clicking on the close button
document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('article-modal').style.display = 'none';
});

// Close the modal when clicking outside the modal content
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('article-modal')) {
        document.getElementById('article-modal').style.display = 'none';
    }
});

const isRegistered = localStorage.getItem("isRegistered");

    function showPopup() {
        if (!isRegistered) {
            document.getElementById("popup").style.display = "flex";
        }
    }

    document.getElementById("close-btn").addEventListener("click", function () {
        document.getElementById("popup").style.display = "none";
    });

    document.getElementById("registration-form").addEventListener("submit", function (e) {
        e.preventDefault(); 
        alert("Registration complete!");
        localStorage.setItem("isRegistered", true); 
        document.getElementById("popup").style.display = "none"; 
    });

    if (!isRegistered) {
        showPopup(); 
        setInterval(showPopup, 300000); 
    }


    