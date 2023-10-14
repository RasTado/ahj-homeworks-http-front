import TicketsServer from "./TicketsServer";

class Ticket {
  static createCard(id, name, description, status, created) {
    const ticket = document.createElement("div");
    ticket.classList.add("ticket");
    ticket.dataset.id = id;

    const ticketMain = document.createElement("div");
    ticketMain.classList.add("ticket__main");

    const ticketLeftPart = document.createElement("div");
    ticketLeftPart.classList.add("left-part");

    const ticketCheckBox = document.createElement("input");
    ticketCheckBox.classList.add("ticket-checkbox");
    ticketCheckBox.type = "checkbox";
    ticketCheckBox.checked = status;
    ticketLeftPart.appendChild(ticketCheckBox);

    const ticketName = document.createElement("span");
    ticketName.classList.add("ticket-name");
    ticketName.textContent = name;
    ticketLeftPart.appendChild(ticketName);

    ticketMain.appendChild(ticketLeftPart);

    const ticketRightPart = document.createElement("div");
    ticketRightPart.classList.add("right-part");

    const ticketTime = document.createElement("span");
    ticketTime.classList.add("ticket-time");
    ticketTime.textContent = created;
    ticketRightPart.appendChild(ticketTime);

    const ticketEdit = document.createElement("button");
    ticketEdit.classList.add("ticket-edit");
    ticketEdit.textContent = "✎";
    ticketRightPart.appendChild(ticketEdit);

    const ticketDelete = document.createElement("button");
    ticketDelete.classList.add("ticket-delete");
    ticketDelete.textContent = "X";
    ticketRightPart.appendChild(ticketDelete);

    ticketMain.appendChild(ticketRightPart);

    ticket.appendChild(ticketMain);

    const ticketSub = document.createElement("div");
    ticketSub.classList.add("ticket__sub");

    const ticketDescription = document.createElement("pre");
    ticketDescription.classList.add("ticket-description");
    ticketDescription.textContent = description;
    ticketSub.appendChild(ticketDescription);

    ticket.appendChild(ticketSub);

    return ticket;
  }
}

export default class TicketsWidget {
  #currentTicket;
  #addOrEdit;

  constructor(container) {
    this.container = container;
    this.ticketBase = new TicketsServer("http://localhost:7070/");

    this.addNewTicketBtn = container.querySelector(".add-ticket");
    this.ticketsContainer = container.querySelector(".tickets-container");

    this.addEditTicketPopup = container.querySelector(".add-edit-ticket");
    this.addEditTicketTitle =
      this.addEditTicketPopup.querySelector(".form-title");
    this.addEditTicketName =
      this.addEditTicketPopup.querySelectorAll(".form-input")[0];
    this.addEditTicketDescription =
      this.addEditTicketPopup.querySelectorAll(".form-input")[1];
    this.addEditCloseBtn = this.addEditTicketPopup.querySelector(".form-reset");
    this.addEditAplyBtn = this.addEditTicketPopup.querySelector(".form-add");

    this.deleteTicketPopup = container.querySelector(".delete-ticket");
    this.deleteTicketPopupCloseBtn =
      this.deleteTicketPopup.querySelector(".form-reset");
    this.deleteTicketPopupApplyBtn =
      this.deleteTicketPopup.querySelector(".form-add");
  }

  get addOrEdit() {
    return this.#addOrEdit;
  }

  set addOrEdit(value) {
    this.#addOrEdit = value;
  }

  get currentTicket() {
    return this.#currentTicket;
  }

  set currentTicket(ticket) {
    this.#currentTicket = ticket;
  }

  init() {
    this.setHandlers();
    this.ticketBase.getAllTickets(this.initTable.bind(this));
  }

  setHandlers() {
    this.addNewTicketBtn.addEventListener(
      "click",
      this.onAddNewTicketBtn.bind(this)
    );
    this.addEditCloseBtn.addEventListener(
      "click",
      this.onAddEditCloseBtn.bind(this)
    );
    this.addEditAplyBtn.addEventListener(
      "click",
      this.onAddEditAplyBtn.bind(this)
    );
    this.ticketsContainer.addEventListener(
      "click",
      this.onTicketsContainer.bind(this)
    );
    this.deleteTicketPopupCloseBtn.addEventListener(
      "click",
      this.closeDeleteTicketWindow.bind(this)
    );
    this.deleteTicketPopupApplyBtn.addEventListener(
      "click",
      this.deleteTicket.bind(this)
    );
  }

  initTable(allTickets) {
    for (const ticket of allTickets) {
      this.addNewTicket(ticket);
    }
  }

  onAddNewTicketBtn() {
    this.addEditTicketPopup.style.visibility = "visible";
    this.addEditTicketTitle.textContent = "Добавить Тикет";
    this.addOrEdit = "add";
  }

  onAddEditCloseBtn() {
    this.addEditTicketPopup.style.visibility = "hidden";
    this.addEditTicketPopup.reset();
    this.addEditTicketDescription.textContent = "";
  }

  onAddEditAplyBtn(e) {
    e.preventDefault();
    const data = new FormData(this.addEditTicketPopup);
    const formName = data.get("name").trim();
    const formDescription = data.get("description").trim();
    if (formName) {
      if (this.addOrEdit === "add") {
        this.ticketBase.createTicket(formName, formDescription, (data) => {
          const { id, name, description, status, created } = data;
          this.ticketsContainer.appendChild(
            Ticket.createCard(id, name, description, status, created)
          );
        });
      } else if (this.addOrEdit === "edit") {
        this.ticketBase.editTicket(
          this.currentTicket.dataset.id,
          formName,
          formDescription,
          () => {
            this.currentTicket.querySelector(".ticket-name").textContent =
              formName;
            this.currentTicket.querySelector(
              ".ticket-description"
            ).textContent = formDescription;
            this.currentTicket = undefined;
          }
        );
      }
      this.addEditTicketPopup.style.visibility = "hidden";
      this.addEditTicketPopup.reset();
      this.addEditTicketDescription.textContent = "";
    }
  }

  onTicketsContainer(e) {
    const targetClassList = e.target.classList;
    const ticket = e.target.closest(".ticket");
    if (
      targetClassList.contains("ticket__main") ||
      targetClassList.contains("ticket-name")
    ) {
      this.showDescription(ticket);
    } else if (targetClassList.contains("ticket-checkbox")) {
      this.changeStatus(ticket);
    } else if (targetClassList.contains("ticket-delete")) {
      this.currentTicket = ticket;
      this.showDeleteTicketWindow();
    } else if (targetClassList.contains("ticket-edit")) {
      this.currentTicket = ticket;
      this.showEditTicketWindow();
    }
  }

  showDescription(ticket) {
    this.ticketBase.getTicketById(ticket.dataset.id, (data) => {
      const ticketDescription = ticket.querySelector(".ticket__sub");

      if (ticketDescription.style.display === "block") {
        ticketDescription.style.display = "none";
      } else {
        const { description } = data;
        ticketDescription.querySelector(".ticket-description").textContent =
          description;
        ticketDescription.style.display = "block";
      }
    });
  }

  changeStatus(ticket) {
    this.ticketBase.changeStatus(ticket.dataset.id, (data) => {
      console.log(data);
    });
  }

  showEditTicketWindow() {
    this.ticketBase.getTicketById(this.currentTicket.dataset.id, (data) => {
      const { name, description } = data;
      this.addEditTicketPopup.style.visibility = "visible";
      this.addEditTicketTitle.textContent = "Изменить Тикет";
      this.addEditTicketName.value = name;
      this.addEditTicketDescription.textContent = description;
      this.addOrEdit = "edit";
    });
  }

  showDeleteTicketWindow() {
    this.deleteTicketPopup.style.visibility = "visible";
  }

  closeDeleteTicketWindow() {
    this.deleteTicketPopup.style.visibility = "hidden";
    this.currentTicket = undefined;
  }

  deleteTicket(e) {
    e.preventDefault();
    this.ticketBase.deleteTicket(this.currentTicket.dataset.id, (data) => {
      this.currentTicket.remove();
      this.currentTicket = undefined;
      this.closeDeleteTicketWindow();
    });
  }

  addNewTicket(ticket) {
    const { id, name, description, status, created } = ticket;
    this.ticketsContainer.appendChild(
      Ticket.createCard(id, name, description, status, created)
    );
  }
}
