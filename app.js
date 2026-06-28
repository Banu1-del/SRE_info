/* ==========================================
   Shree Gowri Enterprise - Client Side Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LIVE SEARCH & PILLED FILTERING
    // ==========================================
    const searchInput = document.getElementById('category-search');
    const filterPills = document.querySelectorAll('.filter-pill');
    const categoryCards = document.querySelectorAll('.category-card');

    let activeFilter = 'all';
    let searchQuery = '';

    const filterCategories = () => {
        categoryCards.forEach(card => {
            const cardTags = card.getAttribute('data-tags') || '';
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDesc = card.querySelector('p').textContent.toLowerCase();
            const cardBrands = card.querySelector('.brand-tags') ? card.querySelector('.brand-tags').textContent.toLowerCase() : '';
            
            // Check if any product matches the search query
            let productMatches = false;
            const productItems = card.querySelectorAll('.product-name');
            productItems.forEach(item => {
                if (item.textContent.toLowerCase().includes(searchQuery)) {
                    productMatches = true;
                }
            });

            const matchesSearch = cardTitle.includes(searchQuery) || 
                                  cardDesc.includes(searchQuery) || 
                                  cardBrands.includes(searchQuery) ||
                                  productMatches;
            const matchesFilter = activeFilter === 'all' || cardTags.includes(activeFilter);

            if (matchesSearch && matchesFilter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    };

    // Search Box key input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterCategories();
    });

    // Pill clicks
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeFilter = pill.getAttribute('data-filter') || 'all';
            filterCategories();
        });
    });

    // ==========================================
    // 2. PRODUCT SHOWCASE COLLAPSE TOGGLE
    // ==========================================
    const toggleProductBtns = document.querySelectorAll('.toggle-products-btn');

    toggleProductBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.category-card');
            const collapsible = card.querySelector('.collapsible-products');
            const isActive = card.classList.contains('active-products');

            // Close all other product showcases for cleaner grid view
            document.querySelectorAll('.category-card').forEach(c => {
                if (c !== card) {
                    c.classList.remove('active-products');
                    const coll = c.querySelector('.collapsible-products');
                    if (coll) coll.style.maxHeight = null;
                }
            });

            if (isActive) {
                card.classList.remove('active-products');
                collapsible.style.maxHeight = null;
            } else {
                card.classList.add('active-products');
                collapsible.style.maxHeight = collapsible.scrollHeight + "px";
                
                // Scroll card into view smoothly after brief delay for expand animation
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 150);
            }
        });
    });

    // ==========================================
    // 3. ACCORDION COMPONENT
    // ==========================================
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        // Initialize dynamic heights
        if (item.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + "px";
        }

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close other items
            accordionItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // ==========================================
    // 4. FORM SUBMISSIONS
    // ==========================================
    const directContactForm = document.getElementById('direct-contact-form');
    const newsletterForm = document.getElementById('newsletter-form');

    // Direct Contact Form bottom
    directContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const phone = document.getElementById('contact-phone').value;
        const message = document.getElementById('contact-message').value;

        // Construct formatting body text for both Email and WhatsApp
        const emailSubject = `Sourcing Inquiry from ${name} - SGE Website`;
        const messageBody = `Hello Shree Gowri Enterprise,\n\nI have submitted a sourcing inquiry via the SGE Catalog website. Here are my requirements:\n\n- Name: ${name}\n- Email: ${email}\n- Phone: ${phone}\n- Message: ${message}\n\nThank you!`;

        // 1. WhatsApp API Link (Opening in a new tab)
        const whatsappUrl = `https://wa.me/918088757772?text=${encodeURIComponent(messageBody)}`;
        window.open(whatsappUrl, '_blank');

        // 2. Send request to localhost backend API
        fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                message
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error || 'Server error'); });
            }
            return response.json();
        })
        .then(data => {
            alert(`Thank you, ${name}! Your sourcing inquiry has been successfully sent to sgenterprises570@gmail.com and WhatsApp.`);
            directContactForm.reset();
        })
        .catch(error => {
            console.error('Error sending email:', error);
            alert(`WhatsApp was opened, but there was an error sending the email via local server: ${error.message}. Please verify the server is running and configured.`);
        });
    });

    // Newsletter subscription footer
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for subscribing to Shree Gowri Enterprise updates!');
            newsletterForm.reset();
        });
    }

    // Sticky Header padding offset scrolling adjustments
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.style.padding = '0.7rem 2rem';
            header.style.backgroundColor = 'rgba(3, 8, 22, 0.95)';
        } else {
            header.style.padding = '1.2rem 2rem';
            header.style.backgroundColor = 'var(--glass-bg)';
        }
    });

    // ==========================================
    // 5. MOBILE BOTTOM NAV TRACKER & SCROLL SPY
    // ==========================================
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    const pageSections = document.querySelectorAll('section, header');
    window.addEventListener('scroll', () => {
        let current = "";
        pageSections.forEach(sec => {
            const secTop = sec.offsetTop;
            if (window.pageYOffset >= (secTop - 220)) {
                current = sec.getAttribute('id') || "";
            }
        });

        if (current) {
            mobileNavItems.forEach(item => {
                item.classList.remove('active');
                const href = item.getAttribute('href');
                if (href === `#${current}` || (current === "home" && href === "#")) {
                    item.classList.add('active');
                }
            });
        }
    });
});
