document.addEventListener("DOMContentLoaded", function () {
  const slidesArray = [
    "https://source.unsplash.com/random/400x400?sig=",
    "https://source.unsplash.com/random/400x400?sig=",
    "https://source.unsplash.com/random/400x400?sig=",
    "https://source.unsplash.com/random/400x400?sig=",
    "https://source.unsplash.com/random/400x400?sig=",
  ];
  const slidesContainer = document.querySelector(".slider-list");
  const sliderButtonsContainer = document.querySelector(".slider-buttons");

  slidesArray.forEach((element, index) => {
    const img = document.createElement("img");
    img.id = index;
    img.className = "slider-item";
    img.src = element + (index + 1);
    slidesContainer.appendChild(img);

    const button = document.createElement("button");
    button.classList.add("slider-button");
    button.addEventListener("click", function () {
      currentIndex = index;
      updateSlider();
    });
    sliderButtonsContainer.appendChild(button);
  });

  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const sliderItems = document.querySelectorAll(".slider-item");

  let currentIndex = 0;
  updateSlider();
  //   setInterval(() => {
  //     updateSlider(currentIndex);
  //     currentIndex = (currentIndex + 1) % sliderItems.length;
  //   }, 2000);
  nextButton.addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % sliderItems.length;
    updateSlider();
  });

  prevButton.addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + sliderItems.length) % sliderItems.length;
    updateSlider();
  });

  function updateSlider() {
    sliderItems.forEach((item, index) => {
      item.classList.remove("active");
      const button = sliderButtonsContainer.children[index];
      button.classList.remove("active-button");
    });
    sliderItems[currentIndex].classList.add("active");
    const activeButton = sliderButtonsContainer.children[currentIndex];
    activeButton.classList.add("active-button");
    const itemWidth = sliderItems[currentIndex].offsetWidth;
    document.querySelector(".slider-list").style.transform = `translateX(${
      -currentIndex * itemWidth
    }px)`;
  }
});
