import { User, Moderator, Admin, Comment } from "./classes";

beforeEach(async () => {
  console.error = jest.fn();
});

describe("OOP Tests", function () {
  it("creates a new user and retrieves username correctly", async () => {
    const username = "User 1";

    const user = new User(username);

    expect(user.getName()).toEqual(username);
  });

  it("user is not logged in by default when created", async () => {
    const username = "User 1";

    const user = new User(username);

    expect(user.isLoggedIn()).toEqual(false);
  });

  it("user can log in correctly", async () => {
    const username = "User 1";

    const user = new User(username);

    await user.logIn();

    expect(user.isLoggedIn()).toEqual(true);
  });

  it("user can log out correctly", async () => {
    const username = "User 1";

    const user = new User(username);

    await user.logIn();
    user.logOut();

    expect(user.isLoggedIn()).toEqual(false);
  });

  it("users cannot change their name before they log in", async () => {
    const oldUsername = "User 1";
    const newUsername = "User 2";

    const user = new User(oldUsername);

    user.setName(newUsername);

    expect(user.getName()).toEqual(oldUsername);
  });

  it("users can change their name after they log in", async () => {
    const oldUsername = "User 1";
    const newUsername = "User 2";

    const user = new User(oldUsername);

    await user.logIn();

    user.setName(newUsername);

    expect(user.getName()).toEqual(newUsername);
  });

  it("cannot change user name to empty string", async () => {
    const oldUsername = "User 1";
    const newUsername = "";

    const user = new User(oldUsername);

    await user.logIn();

    user.setName(newUsername);

    expect(user.getName()).toEqual(oldUsername);
  });

  it("cannot even edit own comment if not logged in", async () => {
    const username = "User 1";
    const message = "Hello world!";

    const user = new User(username);

    const comment = new Comment(user, message);

    expect(user.canEdit(comment)).toEqual(false);
  });

  it("can edit own comment if logged in", async () => {
    const username = "User 1";
    const message = "Hello world!";

    const user = new User(username);

    await user.logIn();

    const comment = new Comment(user, message);

    expect(user.canEdit(comment)).toEqual(true);
  });

  it("cannot edit comment of other users", async () => {
    const username1 = "User 1";
    const username2 = "User 2";
    const message = "Hello world!";

    const user1 = new User(username1);
    const user2 = new User(username2);

    await user1.logIn();

    const comment1 = new Comment(user1, message);

    expect(user2.canEdit(comment1)).toEqual(false);
  });

  it("users cannot delete their own comments", async () => {
    const username = "User 1";
    const message = "Hello world!";

    const user = new User(username);

    await user.logIn();

    const comment = new Comment(user, message);

    expect(user.canDelete(comment)).toEqual(false);
  });

  it("a moderator cannot edit comments if they are not logged in", async () => {
    const username = "User 1";
    const moderatorName = "Moderator 1";
    const message = "Hello world!";

    const user = new User(username);
    const moderator = new Moderator(moderatorName);

    await user.logIn();

    const comment = new Comment(user, message);

    expect(moderator.canEdit(comment)).toEqual(false);
  });

  it("a moderator can edit comments if they are logged in", async () => {
    const username = "User 1";
    const moderatorName = "Moderator 1";
    const message = "Hello world!";

    const user = new User(username);
    const moderator = new Moderator(moderatorName);

    await user.logIn();
    await moderator.logIn();

    const comment = new Comment(user, message);

    expect(moderator.canEdit(comment)).toEqual(true);
  });

  it("a moderator cannot delete comments", async () => {
    const username = "User 1";
    const moderatorName = "Moderator 1";
    const message = "Hello world!";

    const user = new User(username);
    const moderator = new Moderator(moderatorName);

    await user.logIn();
    await moderator.logIn();

    const comment = new Comment(user, message);

    expect(moderator.canDelete(comment)).toEqual(false);
  });

  it("an admin can delete comments if they are logged in", async () => {
    const username = "User 1";
    const adminName = "Admin 1";
    const message = "Hello world!";

    const user = new User(username);
    const admin = new Admin(adminName);

    await user.logIn();
    await admin.logIn();

    const comment = new Comment(user, message);

    expect(admin.canDelete(comment)).toEqual(true);
  });

  it("can get comment message correctly", async () => {
    const username = "User 1";
    const message = "Hello world!";

    const user = new User(username);

    await user.logIn();

    const comment = new Comment(user, message);

    expect(comment.getMessage()).toEqual(message);
  });

  it("can set comment message correctly if author is logged in", async () => {
    const username = "User 1";
    const message1 = "Hello world!";
    const message2 = "Hello There!";

    const user = new User(username);

    await user.logIn();

    const comment = new Comment(user, message1);

    comment.setMessage(message2, user);

    expect(comment.getMessage()).toEqual(message2);
  });

  it("cannot set comment message if author is not logged in", async () => {
    const username = "User 1";
    const message1 = "Hello world!";
    const message2 = "Hello There!";

    const user = new User(username);

    await user.logIn();

    const comment = new Comment(user, message1);

    user.logOut();

    comment.setMessage(message2, user);

    expect(comment.getMessage()).toEqual(message1);
  });

  it("comment author is correctly returned", async () => {
    const username = "User 1";
    const message = "Hello world!";

    const user = new User(username);

    await user.logIn();

    const comment = new Comment(user, message);

    expect(comment.getAuthor()).toEqual(user);
  });

  it("reply to a comment correctly", async () => {
    const username1 = "User 1";
    const username2 = "User 2";
    const message1 = "Hello world!";
    const message2 = "Hello there!";

    const user1 = new User(username1);
    const user2 = new User(username2);

    await user1.logIn();
    await user2.logIn();

    const comment1 = new Comment(user1, message1);
    const comment2 = new Comment(user2, message2, comment1);

    expect(comment2.getRepliedTo()).toEqual(comment1);
    expect(comment2.getRepliedTo()?.getAuthor().getName()).toEqual(username1);
  });

  it("a moderator can edit a user message successfully if logged in", async () => {
    const username = "User 1";
    const moderatorName = "Moderator 1";
    const message1 = "Hello world!";
    const message2 = "Hello there!";

    const user = new User(username);
    const moderator = new Moderator(moderatorName);

    await user.logIn();
    await moderator.logIn();

    const comment = new Comment(user, message1);

    comment.setMessage(message2, moderator);

    expect(comment.getMessage()).toEqual(message2);
  });

  it("a moderator cannot edit a user message if not logged in", async () => {
    const username = "User 1";
    const moderatorName = "Moderator 1";
    const message1 = "Hello world!";
    const message2 = "Hello there!";

    const user = new User(username);
    const moderator = new Moderator(moderatorName);

    await user.logIn();

    const comment = new Comment(user, message1);

    comment.setMessage(message2, moderator);

    expect(comment.getMessage()).toEqual(message1);
  });

  it("an admin can delete a user comment successfully if logged in", async () => {
    const username = "User 1";
    const adminName = "Admin 1";
    const message = "Hello world!";

    const user = new User(username);
    const admin = new Admin(adminName);

    await user.logIn();
    await admin.logIn();

    const comment = new Comment(user, message);

    comment.deleteComment(admin);

    expect(comment.getIsDeleted()).toEqual(true);
  });

  it("an admin cannot delete a user comment if not logged in", async () => {
    const username = "User 1";
    const adminName = "Admin 1";
    const message = "Hello world!";

    const user = new User(username);
    const admin = new Admin(adminName);

    await user.logIn();

    const comment = new Comment(user, message);

    comment.deleteComment(admin);

    expect(comment.getIsDeleted()).toEqual(false);
  });
});
