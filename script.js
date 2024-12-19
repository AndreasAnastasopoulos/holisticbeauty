/* Hover solution for mobile devices */
document.addEventListener('DOMContentLoaded', () => {
    // Function to check if we're on a touch device or small screen
    function isTouchDeviceOrSmallScreen() {
        return (window.innerWidth <= 1024) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    // Only add touch handling if on mobile/touch devices
    if (isTouchDeviceOrSmallScreen()) {
        // Add touch handling to the entire document
        document.addEventListener('touchstart', function (e) {
            // Check if the touched element should have touch interactions
            const target = e.target.closest('[data-touch-interact="true"]');

            if (target) {
                // Prevent default to stop additional events
                e.preventDefault();

                // Add visual feedback
                target.classList.add('touch-active');
            }
        }, { passive: false });

        document.addEventListener('touchend', function (e) {
            const target = e.target.closest('[data-touch-interact="true"]');

            if (target) {
                // Remove visual feedback
                target.classList.remove('touch-active');

                // Simulate a click event
                target.click();
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