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