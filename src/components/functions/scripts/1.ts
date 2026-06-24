import "../../../pages/tours/tours_index.astro"

let currentImageIndex = 0;
    const carouselImages = document.querySelectorAll(".carousel-img");
    const totalImages = carouselImages.length;

    function showImage(index: number): void {
        carouselImages.forEach((img) => img.classList.remove("active"));
        carouselImages[index].classList.add("active");
    }

    function nextImage(): void {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        showImage(currentImageIndex);
    }

    setInterval(nextImage, 10000);