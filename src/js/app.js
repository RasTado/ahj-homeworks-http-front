import TicketsWidget from "./TicketsWidget";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");

  const ticketsWidget = new TicketsWidget(container);

  ticketsWidget.init();
});
