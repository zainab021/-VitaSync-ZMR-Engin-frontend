document.addEventListener("DOMContentLoaded", function () {
  const hospitals = [
    {
      name: "City Care Hospital",
      location: "Faisalabad",
      trust: 88,
      services: ["ICU", "Oxygen", "Emergency", "Doctors"],
      coords: [31.418, 73.079]
    },
    {
      name: "LifeLine Medical Center",
      location: "Faisalabad",
      trust: 67,
      services: ["Oxygen", "Emergency", "Surgery"],
      coords: [31.425, 73.085]
    },
    {
      name: "Green Valley Hospital",
      location: "Faisalabad",
      trust: 43,
      services: ["Doctors", "Basic Emergency"],
      coords: [31.405, 73.065]
    }
  ];

  const map = L.map("map").setView([31.41, 73.08], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  hospitals.forEach((hospital) => {
    L.marker(hospital.coords)
      .addTo(map)
      .bindPopup(`
        <b>${hospital.name}</b><br>
        ${hospital.location}<br>
        Trust Score: ${hospital.trust}/100
      `);
  });

  const moduleBtns = document.querySelectorAll(".module-btn");
  const modules = document.querySelectorAll(".module");

  moduleBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");

      modules.forEach((module) => module.classList.remove("active"));
      moduleBtns.forEach((button) => button.classList.remove("active"));

      document.getElementById(targetId).classList.add("active");
      this.classList.add("active");

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    });
  });

  const searchBtn = document.getElementById("search-btn");
  const searchBox = document.getElementById("search-box");
  const results = document.getElementById("results");

  function getScoreClass(score) {
    if (score >= 76) {
      return "high";
    } else if (score >= 50) {
      return "medium";
    } else {
      return "low";
    }
  }

  function showHospitals(hospitalList) {
    results.innerHTML = "";

    hospitalList.forEach((hospital, index) => {
      const scoreClass = getScoreClass(hospital.trust);

      const card = document.createElement("div");
      card.className = "hospital-card";
      card.style.animationDelay = `${index * 0.12}s`;

      card.innerHTML = `
        <h3>${hospital.name}</h3>
        <p>${hospital.location}</p>

        <div class="tags">
          ${hospital.services
            .map((service) => `<span class="tag">${service}</span>`)
            .join("")}
        </div>

        <p class="trust-score ${scoreClass}">
          Trust Score: ${hospital.trust}/100
        </p>
      `;

      results.appendChild(card);
    });
  }

  searchBtn.addEventListener("click", function () {
    const query = searchBox.value.toLowerCase().trim();

    if (query === "") {
      showHospitals(hospitals);
      return;
    }

    const filteredHospitals = hospitals.filter((hospital) =>
      hospital.services.some((service) =>
        query.includes(service.toLowerCase())
      )
    );

    const finalResults = filteredHospitals.length ? filteredHospitals : hospitals;

    showHospitals(finalResults);
  });

  searchBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchBtn.click();
    }
  });

  const aiBtn = document.getElementById("ai-btn");
  const aiInput = document.getElementById("ai-input");
  const aiOutput = document.getElementById("ai-output");

  function typeText(element, text, speed = 25) {
    element.innerHTML = "";
    let index = 0;

    const typing = setInterval(() => {
      element.innerHTML += text.charAt(index);
      index++;

      if (index >= text.length) {
        clearInterval(typing);
      }
    }, speed);
  }

  aiBtn.addEventListener("click", function () {
    const input = aiInput.value.toLowerCase().trim();

    let response = "";

    if (input.includes("icu") && input.includes("oxygen")) {
      response =
        "Recommended: City Care Hospital. Reason: ICU, oxygen, emergency support and high trust score are available.";
    } else if (input.includes("emergency")) {
      response =
        "Recommended: LifeLine Medical Center. Reason: Emergency and oxygen support are available.";
    } else if (input.includes("surgery")) {
      response =
        "Recommended: LifeLine Medical Center. Reason: Surgery and emergency support are detected.";
    } else {
      response =
        "Please enter a clearer medical need, for example ICU, oxygen, surgery, or emergency.";
    }

    typeText(aiOutput, response, 22);
  });

  const trustScore = 88;
  const scoreCircle = document.querySelector(".score-circle");

  if (scoreCircle) {
    scoreCircle.style.background = `conic-gradient(#16a34a ${trustScore}%, #e2e8f0 0)`;
  }

  showHospitals(hospitals);
});