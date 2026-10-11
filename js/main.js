
document.addEventListener("DOMContentLoaded", () => {
  // Elementos generales
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Año automático en el pie de página
  const year = $("#year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Mostrar notificaciones
  let toastTimer;

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  // Menú para celulares
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Filtros de destinos
  const filterButtons = $$(".filter-chip");
  const destinationCards = $$(".destination-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      destinationCards.forEach((card) => {
        const matches =
          filter === "todos" || card.dataset.category === filter;

        card.hidden = !matches;
      });
    });
  });

  // Guardar destinos favoritos
  let savedCount = 0;
  const savedStatus = $("#savedStatus");

  $$("[data-save]").forEach((button) => {
    button.addEventListener("click", () => {
      const isSaved = button.classList.toggle("saved");

      button.textContent = isSaved ? "♥" : "♡";
      button.setAttribute("aria-pressed", String(isSaved));

      savedCount += isSaved ? 1 : -1;

      if (savedStatus) {
        savedStatus.textContent =
          savedCount === 0
            ? "♡ Guarda tus destinos favoritos tocando el corazón."
            : `♥ Tienes ${savedCount} destino${savedCount === 1 ? "" : "s"} favorito${savedCount === 1 ? "" : "s"}.`;
      }

      showToast(
        isSaved
          ? "Destino añadido a tus favoritos ♥"
          : "Destino eliminado de tus favoritos."
      );
    });
  });

  // Ideas de viaje según el estado de ánimo
  const moodIdeas = {
    relax:
      "☁ Tu plan ideal: una escapada a un lugar tranquilo, rodeado de naturaleza, con tiempo para descansar y disfrutar sin prisas.",
    aventura:
      "✦ Tu plan ideal: una ruta de montaña, un paseo al aire libre y un lugar nuevo por descubrir.",
    romantico:
      "♡ Tu plan ideal: un pueblo encantador, una cena especial y un atardecer para recordar.",
    cultura:
      "✿ Tu plan ideal: visitar un centro histórico, probar la comida local y conocer las tradiciones del destino."
  };

  const moodResult = $("#moodResult");

  $$(".experience-card").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".experience-card").forEach((item) => {
        item.classList.toggle("selected", item === button);
      });

      if (moodResult) {
        moodResult.textContent =
          moodIdeas[button.dataset.mood] ||
          "✿ Descubre un destino nuevo y crea recuerdos especiales.";
      }
    });
  });

  // Formulario demostrativo de correo
  const newsletterForm = $("#newsletterForm");
  const newsletterMessage = $("#newsletterMessage");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const emailInput = $("#emailInput");

      if (!emailInput || !emailInput.checkValidity()) {
        emailInput?.reportValidity();
        return;
      }

      if (newsletterMessage) {
        newsletterMessage.textContent =
          "¡Gracias por apuntarte! ♡ Este formulario es una demostración.";
      }

      newsletterForm.reset();
    });
  }

  // CHAT FLOTANTE DE JOVI
  const chatPopup = $("#chatPopup");
  const chatLauncher = $("#chatLauncher");
  const closeChat = $("#closeChat");
  const clearChat = $("#clearChat");
  const chatMessages = $("#chatMessages");
  const chatForm = $("#chatForm");
  const chatInput = $("#chatInput");
  const openChatFromNav = $("#openChatFromNav");

  const initialBotMessage =
    "¡Holiii! 🌷 Soy Jovi, tu compañera de aventuras. ¿Qué tipo de lugar te gustaría descubrir?";

  // Abrir y cerrar el chat
  function setChatOpen(open) {
    if (!chatPopup || !chatLauncher) return;

    chatPopup.classList.toggle("open", open);

    // Refuerzo para que el chat se muestre correctamente
    chatPopup.style.display = open ? "flex" : "none";
    chatPopup.style.visibility = open ? "visible" : "hidden";
    chatPopup.style.opacity = open ? "1" : "0";

    chatPopup.setAttribute("aria-hidden", String(!open));
    chatLauncher.setAttribute("aria-expanded", String(open));

    const launcherText = chatLauncher.querySelector(
      "span:nth-child(2)"
    );
    const launcherIcon = chatLauncher.querySelector(".launcher-icon");

    if (launcherText) {
      launcherText.textContent = open ? "Cerrar chat" : "Habla con Jovi";
    }

    if (launcherIcon) {
      launcherIcon.textContent = open ? "×" : "♡";
    }

    if (open && chatInput) {
      setTimeout(() => chatInput.focus(), 100);
    }
  }

  // El chat empieza cerrado
  setChatOpen(false);

  // El botón flotante abre y cierra el chat
  if (chatLauncher) {
    chatLauncher.addEventListener("click", () => {
      const isOpen = chatPopup?.classList.contains("open");
      setChatOpen(!isOpen);
    });
  }

  // Botón X para cerrar
  if (closeChat) {
    closeChat.addEventListener("click", () => {
      setChatOpen(false);
    });
  }

  // Abrir el chat desde el menú
  if (openChatFromNav) {
    openChatFromNav.addEventListener("click", (event) => {
      event.preventDefault();
      setChatOpen(true);
    });
  }

  // Agregar mensajes a la conversación
  function addMessage(text, sender = "bot") {
    if (!chatMessages) return;

    const message = document.createElement("div");
    message.classList.add("message");

    message.classList.add(
      sender === "user" ? "user-message" : "bot-message"
    );

    // Usar textContent evita interpretar el mensaje como HTML
    message.textContent = text;

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Respuestas automáticas de Jovi
  function getBotReply(message) {
    const text = message.toLowerCase();

    if (
      text.includes("hola") ||
      text.includes("buenas") ||
      text.includes("holi")
    ) {
      return "¡Holaaa! 🌸 Qué alegría tenerte aquí. ¿Buscas playa, naturaleza o una ciudad bonita?";
    }

    if (
      text.includes("playa") ||
      text.includes("mar") ||
      text.includes("caribe")
    ) {
      return "🏝️ ¡Plan playero! Puedes buscar destinos del Caribe, playas de agua turquesa y lugares para descansar junto al mar. ¿Prefieres tranquilidad o aventura?";
    }

    if (
      text.includes("naturaleza") ||
      text.includes("montaña") ||
      text.includes("montana") ||
      text.includes("bosque")
    ) {
      return "🌿 Te recomiendo explorar montañas, lagos y senderos naturales. Lleva ropa cómoda y tómate tiempo para disfrutar del paisaje.";
    }

    if (
      text.includes("ciudad") ||
      text.includes("cultura") ||
      text.includes("parís") ||
      text.includes("paris")
    ) {
      return "🏙️ ¡Una escapada cultural! Busca ciudades con museos, cafés, arquitectura bonita y recorridos por sus centros históricos.";
    }

    if (
      text.includes("colombia") ||
      text.includes("colombiano")
    ) {
      return "🇨🇴 ¡Colombia tiene lugares preciosos! Puedes explorar Cartagena, el Eje Cafetero, Santa Marta o pueblos llenos de color. ¿Qué tipo de paisaje te gusta?";
    }

    if (
      text.includes("presupuesto") ||
      text.includes("barato") ||
      text.includes("económico") ||
      text.includes("economico")
    ) {
      return "💗 Para cuidar tu presupuesto, compara el transporte y el alojamiento, viaja en temporada baja y busca actividades gratuitas. ¿Desde qué ciudad saldrías?";
    }

    if (
      text.includes("romántico") ||
      text.includes("romantico") ||
      text.includes("pareja")
    ) {
      return "♡ ¡Qué bonito plan! Busca un destino con atardeceres, restaurantes acogedores y paseos tranquilos. También puedes considerar un pueblo cercano para una escapada corta.";
    }

    if (
      text.includes("gracias")
    ) {
      return "¡Con mucho cariño! 🌷 Aquí estaré para ayudarte a imaginar tu próxima aventura.";
    }

    if (
      text.includes("ayuda") ||
      text.includes("recomienda") ||
      text.includes("recomendar")
    ) {
      return "¡Claro que sí! ✨ Cuéntame tres cositas: ¿playa o montaña?, ¿viaje corto o largo?, ¿y qué presupuesto tienes en mente?";
    }

    return "¡Qué buena idea! 🌷 Puedo darte ideas de playas, naturaleza, ciudades y escapadas económicas. Cuéntame qué te gustaría conocer y buscamos una idea de viaje.";
  }

  // Enviar mensajes escritos
  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const message = chatInput.value.trim();

      if (!message) return;

      addMessage(message, "user");
      chatInput.value = "";

      // Respuesta automática del chat demostrativo
      setTimeout(() => {
        addMessage(getBotReply(message), "bot");
      }, 400);
    });
  }

  // Respuestas rápidas
  $$(".quick-replies button").forEach((button) => {
    button.addEventListener("click", () => {
      const message = button.dataset.reply;

      if (!message) return;

      addMessage(message, "user");

      setTimeout(() => {
        addMessage(getBotReply(message), "bot");
      }, 400);
    });
  });

  // Reiniciar la conversación
  if (clearChat && chatMessages) {
    clearChat.addEventListener("click", () => {
      chatMessages.innerHTML = "";
      addMessage(initialBotMessage, "bot");
      showToast("Conversación reiniciada ♡");
    });
  }
});
