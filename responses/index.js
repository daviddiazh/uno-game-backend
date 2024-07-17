export class ResponseEntity {
    constructor({ code, title, description, }) {
      this.error = {
        code,
        title,
        description,
      };
    }
}