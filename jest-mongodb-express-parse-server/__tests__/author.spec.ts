import { createUser, deleteUser, getUser } from "./mock";

describe('Author test', () => {
  it('should user in user test case not defined', async () => {
    const user = await getUser('john');
    expect(user).toBeUndefined();
  });

  it('should create user', async () => {
    const user = await createUser();
    expect(user).toBeDefined();
  });

  it('should get user', async () => {
    const user = await getUser('john');
    expect(user).toBeDefined();
  });

  it('should get user not exist', async () => {
    const user = await getUser('john2');
    expect(user).toBeUndefined();
  });

  it('should delete author', async () => {
    await deleteUser('john');
    const user = await getUser('john');
    expect(user).toBeUndefined();
  });
});