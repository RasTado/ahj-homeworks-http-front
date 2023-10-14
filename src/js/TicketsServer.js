export default class TicketsServer {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getAllTickets(callback) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState !== 4) {
        return;
      }

      try {
        const ticketsList = JSON.parse(xhr.responseText);
        callback(ticketsList);
        return ticketsList;
      } catch (err) {
        console.log(err);
      }
    });

    xhr.open("GET", `${this.baseUrl}?method=allTickets`);

    xhr.send();
  }

  getTicketById(id, callback) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState !== 4) {
        return;
      }

      try {
        const ticket = JSON.parse(xhr.responseText);
        callback(ticket);
      } catch (err) {
        console.log(err);
      }
    });

    xhr.open("GET", `${this.baseUrl}?method=ticketById&id=${id}`);

    xhr.send();
  }

  createTicket(name, description, callback) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState !== 4) {
        return;
      }

      try {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      } catch (err) {
        console.log(err);
      }
    });
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    xhr.open("POST", `${this.baseUrl}?method=createTicket`);

    xhr.send(formData);
  }

  changeStatus(id, callback) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState !== 4) {
        return;
      }

      try {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      } catch (err) {
        console.log(err);
      }
    });
    xhr.open("PATCH", `${this.baseUrl}?method=changeStatus&id=${id}`);

    xhr.send();
  }

  editTicket(id, name, description, callback) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState !== 4) {
        return;
      }

      try {
        const response = xhr.responseText;
        callback(response);
      } catch (err) {
        console.log(err);
      }
    });
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    xhr.open("PATCH", `${this.baseUrl}?method=editTicket&id=${id}`);

    xhr.send(formData);
  }

  deleteTicket(id, callback) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState !== 4) {
        return;
      }

      try {
        const response = xhr.responseText;
        callback(response);
      } catch (err) {
        console.log(err);
      }
    });
    xhr.open("DELETE", `${this.baseUrl}?method=deleteTicket&id=${id}`);

    xhr.send();
  }
}
