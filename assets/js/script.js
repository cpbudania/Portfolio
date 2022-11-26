// Navbar
console.clear();
const uls = document.querySelectorAll("nav ul");
const links = [...document.querySelectorAll("nav a")];
const light = document.querySelector("nav .tubelight");
let activeIndex = 0;
let currentIndex = 0;
let increment = 1;
links.forEach((link, index) => {
  if (links[index].classList.contains("active")) {
    light.style.left = `${links[index].offsetLeft + light.offsetWidth / 4}px`;
  }
  link.addEventListener("click", (e) => {
    activeIndex = index;
    let t = setInterval(() => {
      if (activeIndex > currentIndex) increment = 1;
      else if (activeIndex < currentIndex) increment = -1;
      currentIndex += increment;

      links[currentIndex].classList.add("active");
      if (currentIndex != -1)
        links[currentIndex - increment].classList.remove("active");

      if (currentIndex == activeIndex) {
        e.target.classList.add("active");
        increment = 0;
        clearInterval(t);
      }
    }, 50);
    light.style.left = `${e.target.offsetLeft + light.offsetWidth / 4}px`;
  });
});

// page navigation variables
$(document).ready(function () {
  // When page loads...:
  $("section.content section").hide(); // Hide all content

  /* Check for hashtag in url */
  if (window.location.hash.length > 0) {
    console.log(window.location.hash);
    /*find the menu item with this hashtag*/
    $("nav li a").each(function () {
      if ($(this).attr("href") == window.location.hash)
        $(this).parent().addClass("current").show(); // Activate page in menu
    });
    $(window.location.hash).fadeIn(); // Fade in the active page content
  } else {
    /* no hashtag: */
    $("nav li:first").addClass("current").show(); // Activate first page
    $("section.content section:first").show(); // Show first page content
  }

  // On Click Event (within list-element!)
  $("nav li").click(function () {
    $("nav li").removeClass("current"); // Remove any active class
    $(this).addClass("current"); // Add "current" class to selected page

    $("section.content section").hide(); // Hide all content

    // Find the href attribute value to identify the active page:
    var activePage = $(this).find("a").attr("href");
    $(activePage).fadeIn(); // Fade in the active page
  }); // end click method
}); // end $(document).ready method

// Skills Section
async function fetchData(type = "skills") {
  let response;
  type === "skills"
    ? (response = await fetch(
        "/skills.json"
      ))
    : (response = await fetch(""));
  const data = await response.json();
  return data;
}

function showSkills(skills) {
  let skillsContainer = document.getElementById("skillsContainer");
  let skillHTML = "";
  skills.forEach((skill) => {
    skillHTML += `
        <div class="skbar">
              <div class="skinfo">
                <img src=${skill.icon} alt="skill" />
                <p>${skill.name}</p>
              </div>
            </div>`;
  });
  skillsContainer.innerHTML = skillHTML;
}

fetchData().then((data) => {
  showSkills(data);
});

// Send Form Using js
const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
  const formData = new FormData(form);
  e.preventDefault();
  var object = {};
  formData.forEach((value, key) => {
    object[key] = value;
  });
  var json = JSON.stringify(object);
  result.innerHTML = "Please wait...";

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: json
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        result.innerHTML = json.message;
        result.classList.remove("text-gray-500");
        result.classList.add("text-green-500");
      } else {
        console.log(response);
        result.innerHTML = json.message;
        result.classList.remove("text-gray-500");
        result.classList.add("text-red-500");
      }
    })
    .catch((error) => {
      console.log(error);
      result.innerHTML = "Something went wrong!";
    })
    .then(function () {
      form.reset();
      setTimeout(() => {
        result.style.display = "none";
      }, 5000);
    });
});