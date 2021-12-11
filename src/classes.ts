export class User {
  constructor(name: string) {
    this.name = name;

    this.logOut();
  }

  private name!: string;
  private loggedIn!: boolean;
  private lastLoggedInAt!: Date;

  isLoggedIn() {
    return this.loggedIn;
  }

  getLastLoggedInAt() {
    return this.lastLoggedInAt;
  }

  private authentication() {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (true) {
          resolve();
        } else {
          reject("Request hit the wall!");
        }
      }, 100);
    });
  }

  async logIn() {
    try {
      await this.authentication();

      this.loggedIn = true;
      this.lastLoggedInAt = new Date();
    } catch (error) {
      throw new Error(`Failed to log in: ${error}`);
    }
  }

  logOut() {
    this.loggedIn = false;
  }

  getName() {
    return this.name;
  }

  setName(name: string) {
    try {
      if (!this.isLoggedIn()) {
        throw new Error(
          "User needs to be logged-in in order for them to change their name!"
        );
      } else if (name === "") {
        throw new Error("User name cannot be empty!");
      } else {
        this.name = name;
      }
    } catch (error) {
      console.error(error);
    }

    return this.name;
  }

  canEdit(comment: Comment) {
    return this.isLoggedIn() && comment.getAuthor().name === this.name;
  }

  canDelete(comment: Comment) {
    return false;
  }
}

export class Moderator extends User {
  canEdit(comment: Comment) {
    return this.isLoggedIn();
  }
}

export class Admin extends Moderator {
  canDelete(comment: Comment) {
    return this.isLoggedIn();
  }
}

export class Comment {
  constructor(author: User, message: string, repliedTo?: Comment) {
    this.author = author;
    this.setMessage(message, author);
    this.repliedTo = repliedTo;
    this.createdAt = new Date();
    this.isDeleted = false;
  }

  private author: User;
  private message!: string;
  private repliedTo?: Comment;
  private createdAt: Date;
  private isDeleted: boolean;

  getMessage() {
    return this.message;
  }

  setMessage(message: string, responsibleUser: User) {
    try {
      if (!responsibleUser.isLoggedIn()) {
        throw new Error("Responsible user is not logged in!");
      } else if (message === "") {
        throw new Error("Message cannot be empty string!");
      } else {
        this.message = message;
      }
    } catch (error) {
      console.error(error);
    }
  }

  deleteComment(responsibleUser: User) {
    try {
      if (!responsibleUser.isLoggedIn()) {
        throw new Error("Responsible user is not logged in!");
      } else {
        this.isDeleted = true;
      }
    } catch (error) {
      console.error(error);
    }
  }

  getIsDeleted() {
    return this.isDeleted;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getAuthor() {
    return this.author;
  }

  getRepliedTo() {
    return this.repliedTo;
  }

  toString() {}
}
