export class Framework {
    // id: string;
    // title: string;
    // description: string;

    // adding the `public` accessor in the constructor parameters, Nest automatically creates the equally names property
    constructor(public id: string, public title: string, public description: string){

        // this.id = id;
        // this.title = title;
        // this.description = description;

    }
}