import { Injectable, NotFoundException } from '@nestjs/common';
import { Framework } from './frameworks.model';

@Injectable()
export class FrameworksService {
  //Initializing by using the Framework model to be of Array type with an empty array
  // using `private` accessor so that frameworks array is accessed only by the Frameworks Service.
  private frameworks: Framework[] = [];

  // Method(service) to insert a framework
  insertFramework(title: string, description: string) {
    const prodId = Math.floor(Math.random() * 10 ** 5).toString();
    const newFramework = new Framework(prodId, title, description);
    this.frameworks.push(newFramework);
    return prodId;
  }

  getFrameworks() {
    // returning a new array with the data of frameworks array
    // because arrays work as Call by reference and we dont need to send the memory reference.
    return [...this.frameworks];
  }

  getSingleFramework(frameworkId: string) {
    const [framework, index] = this.findFramework(frameworkId);
    return { framework };
  }

  updateFramework(
    frameworkId: string,
    title: string,
    description: string,
  ) {
    const [framework, index] = this.findFramework(frameworkId);
    const updatedFramework = {...framework};
    if(title){
        updatedFramework.title = title;
    }
    if(description){
        updatedFramework.description = description;
    }
    this.frameworks[index] = updatedFramework;
    return updatedFramework;
  }

  removeFramework(frameworkId: string){
    const index = this.findFramework(frameworkId)[1];
    this.frameworks.splice(index, 1);
    return {
        message: "Framework deleted",
        frameworkId
    }
  }

  private findFramework(id: string): [Framework, number] {
    const frameworkIndex = this.frameworks.findIndex((prod) => prod.id === id);
    const framework = this.frameworks[frameworkIndex];
    if (!framework) {
      // NestJS will automatically throw a 404 error
      throw new NotFoundException('Framework not found.');
    }
    return [framework, frameworkIndex];
  }
}
