document.addEventListener('DOMContentLoaded', () => {
    const carusel = document.querySelector(".carusel");
    const prevButton = document.querySelector(".prev-button");
    const nextButton = document.querySelector(".next-button");
    const containers = document.querySelectorAll(".img-container");
    const goButton = document.getElementById("go-button");

    prevButton.addEventListener('click', () => {
        carusel.scrollBy({
            left: -130,
        });
    });

    nextButton.addEventListener('click', () => {
        carusel.scrollBy({
            left: 130,
        });
    });


  containers.forEach(container => {
    const link = container.querySelector("img").dataset.link;


    container.addEventListener("click", () => {
      
      containers.forEach(c => c.classList.remove("selected"));

      
      container.classList.add("selected");

     
      goButton.style.display = "inline-block";

      
      goButton.onclick = (e) => {
        e.stopPropagation();
        window.location.href = link;;
      };
    });
  });
});
