/* Toggle hover or no hover on touch devices */
document.addEventListener("DOMContentLoaded", () => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        let currentActiveElement = null;
        const elements = document.querySelectorAll('a.inline-fancy, .text-box h1, .hero-btn, .container, .scrollable-card-2, .service-photo img, .list-in-main a.inline-fancy, .submit-btn, a.inline-fancy-footer, .menu-wrap .toggler:checked, .underline-hover-btn, .delayedPopupWindow .submit-btn, #btnClose, .scroll-to-top');

        elements.forEach(element => {
            element.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                // If clicking the currently active element, deactivate it
                if (currentActiveElement === element) {
                    element.classList.remove('hover-active');
                    currentActiveElement = null;
                    return;
                }

                // Remove active class from previous element
                if (currentActiveElement) {
                    currentActiveElement.classList.remove('hover-active');
                }

                // Activate new element
                element.classList.add('hover-active');
                currentActiveElement = element;
            });
        });

        // Remove "hover-active" from all elements when clicking outside
        document.addEventListener('click', () => {
            if (currentActiveElement) {
                currentActiveElement.classList.remove('hover-active');
                currentActiveElement = null;
            }
        });
    }
});





/* // Email Sender Component
    // Original work by Basharath (https://github.com/Basharath/FormEasy)
    // MIT Licensed - See LICENSE file for full details */
function handleSubmit(event) {
    event.preventDefault();

    const form = event.target; // Get the form that was submitted
    const consentCheckbox = form.querySelector('#consentCheckbox');

    if (!consentCheckbox.checked) {
        alertbox.render({
            alertIcon: 'error',
            title: 'Κάτι πήγε λάθος...',
            message: 'Παρακαλώ αποδεχτείτε τους όρους πριν υποβάλετε τη φόρμα.',
            btnTitle: 'Συνέχεια',
            themeColor: '#503b31',
            btnColor: '#503b31',
            border: true
        });
        return;
    }

    console.log('Form submission started');

    const data = {
        // Check if these elements exist before trying to get their value
        name: form.querySelector('#name') ? form.querySelector('#name').value : '',
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone') ? form.querySelector('#phone').value : ''
    };

    console.log('Sending data:', data);

    fetch('submit_form.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            console.log('Response received:', response);
            return response.json();
        })
        .then(result => {
            console.log('Success:', result);
            form.reset(); // Reset the specific form that was submitted
            alertbox.render({
                alertIcon: 'success',
                title: 'Ευχαριστούμε για την εμπιστοσύνη.',
                message: 'Αγκαλιάστε την μοναδικότητά σας!',
                btnTitle: 'Συνέχεια',
                themeColor: '#247E00',
                btnColor: '#247E00',
                border: true
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alertbox.render({
                alertIcon: 'error',
                title: 'Κάτι πήγε λάθος...',
                message: 'Ξανασυμπληρώστε την φόρμα.',
                btnTitle: 'Συνέχεια',
                themeColor: '#503b31',
                btnColor: '#503b31',
                border: true
            });
            form.reset(); // Reset the specific form that was submitted
        });
}

// Make sure the event listener is attached
document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('#contactForm');
    forms.forEach(form => {
        form.addEventListener('submit', handleSubmit);
    });
});