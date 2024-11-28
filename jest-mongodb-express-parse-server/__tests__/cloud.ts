Parse.Cloud.afterSave('TestObject', async (request) => {
  const object = request.object;

  // Add a new field or modify the object after it's saved
  if (!object.get('processed')) {
    object.set('processed', true);
    await object.save(null, { useMasterKey: true });
  }
});
