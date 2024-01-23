# Intelligence Hub Backend :

## Development :

### Initial CRUD operations addition : 

1. Create a folder named with features name like for eeg : `framworks`.
   1. It will have `.module`. `.service`, `.model` files.
2. Add the module to the `app.module.ts`.
   1. And also manually connect to the mongodb compass with the help of MongooseModule.forRoot().
```ts
    MongooseModule.forRoot('mongodb://localhost:27017/intelligence'),
```
3. In the `frameworks.model.ts` file, make the schema which will be used to create a database model and Nest will register it using the `@Schema` decorator.
4. Then use that model in the `frameworks.service.ts` by injecting it with the help of `@InjectModel` decorator 
   1. and write all main business logic of CRUD operations and export those function definitions. 
5. The functions defined in the service file will be used by the `frameworks.controller.ts` for defining all the HTTP methods using Nest decorators.
6. Now to combine all this work, `frameworks.module.ts` is used.