export const createUser = async (): Promise<Parse.User> => {
  const user = new Parse.User();
  user.set('username', 'john');
  user.set('email', 'user@gmail.com');
  user.set('password', 'password');
  const savedUser = await user.save(null, { useMasterKey: true });
  return savedUser;
}

export const getUser = async (username: string): Promise<Parse.User | undefined> => {
  const user = new Parse.Query(Parse.User)
    .equalTo('username', username)
    .first({ useMasterKey: true });
  return user;
}

export const createArticleByAuthor = async (author: Parse.User | undefined): Promise<Parse.Object> => {
  if (!author) {
    throw new Error('Author is required');
  }
  const Article = Parse.Object.extend('Article');
  const article = new Article();
  article.set('title', 'title');
  article.set('content', 'content');
  article.set('author', author);
  const savedArticle = await article.save();
  return savedArticle;
}

export const deleteArticleByAuthor = async (author: Parse.User): Promise<void> => {
  const Article = Parse.Object.extend('Article');
  const query = new Parse.Query(Article);
  query.equalTo('author', author);
  const articles = await query.find({ useMasterKey: true });
  for (const article of articles) {
    await article.destroy();
  }
}

export const deleteUser = async (username: string): Promise<void> => {
  const user = await getUser(username);
  await deleteArticleByAuthor(user!);
  if (user) {
    await user.destroy({ useMasterKey: true });
  }
}