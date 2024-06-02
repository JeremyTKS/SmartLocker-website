document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("registerButton").addEventListener("click", function() {
        window.location.href = "register.html";
    });

    document.getElementById("lockerButton").addEventListener("click", function() {
        window.location.href = "locker_condition.html";
    });

    document.getElementById("paymentButton").addEventListener("click", function() {
        window.location.href = "payment.html";
    });
});
