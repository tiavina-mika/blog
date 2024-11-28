import { createArticleByAuthor, createUser, getUser } from "./mock";

describe('Article test', () => {
  let Article: Parse.ObjectConstructor;

  let author: Parse.User;

  beforeAll(async () => {
    Article = Parse.Object.extend('Article');
    author = await createUser()
  });

  it('should user in author test case not defined', async () => {
    const user = await getUser('user');
    expect(user).toBeUndefined();
  });

  it('should create article', async () => {
    const article = await createArticleByAuthor(author);
    expect(article).toBeDefined();
  });

  it('should author not defined', async () => {
    try {
      await createArticleByAuthor(undefined);
    } catch (error) {
      expect((error as Error).message).toBe('Author is required');
    }
  });
});
