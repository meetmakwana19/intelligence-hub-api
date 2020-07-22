module.exports = {
  async up(db, client) {
    await db.createCollection('todos', {
      validator: {
         $jsonSchema: {
            bsonType: 'object',
            required: ['text', 'completed'],
            properties: {
               text: {
                  bsonType: 'string',
                  description: 'Todo text'
               },
               completed: {
                  bsonType: 'bool',
                  description: 'Denotes if the task is marked complete'
               },
            }
         }
      }
    });
  },

  async down(db, client) {
    await db.collection('todos').drop();
  }
};
