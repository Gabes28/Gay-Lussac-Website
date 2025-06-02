    document.addEventListener("DOMContentLoaded", function () {
      // --- Pressure Calculation Section ---
      const T0 = 300; // Baseline temperature (K)
      const P0 = 1;   // Baseline pressure (atm)
      let currentTemperature = T0; // This variable alters particle speed

      const tempSlider     = document.getElementById("tempSlider");
      const tempDisplay    = document.getElementById("tempDisplay");
      const pressureDisplay = document.getElementById("pressureDisplay");
      const pressureBar    = document.getElementById("pressureBar");

      function updateSimulation() {
        const T = parseFloat(tempSlider.value);
        currentTemperature = T; // Update global temperature used in animation
        tempDisplay.textContent = T;

        // Calculate pressure: P = P₀ * (T / T₀)
        const pressure = P0 * (T / T0);
        pressureDisplay.textContent = pressure.toFixed(2) + " atm";

        // Map pressure to gauge width (based on T = 200 K and 800 K)
        const P_min = P0 * (200 / T0);
        const P_max = P0 * (800 / T0);
        const percentage = ((pressure - P_min) / (P_max - P_min)) * 100;
        pressureBar.style.width = percentage + "%";
      }

      tempSlider.addEventListener("input", updateSimulation);
      updateSimulation(); // Initialize display with default value

      // --- Gas Molecule Motion Visualization Section ---
      const canvas = document.getElementById("gasCanvas");
      const ctx = canvas.getContext("2d");
      const numParticles = 40;
      const particles = [];

      function initParticles() {
        for (let i = 0; i < numParticles; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            angle: Math.random() * 2 * Math.PI,
            baseSpeed: 1 + Math.random() * 1.5 // Base speed at T₀
          });
        }
      }
      initParticles();

      function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Speed factor scales with (T / T₀)
        const speedFactor = currentTemperature / T0;

        particles.forEach(function (particle) {
          const speed = particle.baseSpeed * speedFactor;
          particle.x += Math.cos(particle.angle) * speed;
          particle.y += Math.sin(particle.angle) * speed;

          // Bounce off the horizontal boundaries
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.angle = Math.PI - particle.angle;
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
          }
          // Bounce off the vertical boundaries
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.angle = -particle.angle;
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
          }

          // Draw each particle (gas molecule)
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = "#FF5722";
          ctx.fill();
        });
        requestAnimationFrame(animateParticles);
      }
      animateParticles();
    });
