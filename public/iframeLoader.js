document.addEventListener("DOMContentLoaded", function() {
    const sdk = new AppExtensionsSDK(); // Инициализация SDK

    // Кнопка для открытия iframe
    document.getElementById("your-button-id").addEventListener("click", function() {
        sdk.openModal({
            url: 'https://iframe-alpha.vercel.app/?token=YOUR_TOKEN_FROM_DB',
            options: {
                title: 'Your Iframe Title',
                width: 400,
                height: 600
            }
        });
    });
});