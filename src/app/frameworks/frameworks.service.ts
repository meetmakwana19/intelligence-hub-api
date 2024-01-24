import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Framework } from './frameworks.model';
import { Collection, DataAccessLevel, InjectDAO } from '@contentstack/mongodb';
import { INTELLIGENCE_DB } from 'src/framework/utils';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FrameworksService {
  //Initializing by using the Framework model to be of Array type with an empty array
  // using `private` accessor so that frameworks array is accessed only by the Frameworks Service.
  // private frameworks: Framework[] = [];

  // private readonly frameworks: any;
  // @InjectDAO(INTELLIGENCE_DB, DataAccessLevel.FULL_ACCESS)

  // @Inject('MONGODB')
  // private db: any

  // constructor(@InjectDAO(INTELLIGENCE_DB, DataAccessLevel.FULL_ACCESS) private db) {
  //   this.frameworks = db.collection('framework');
  // }

  constructor(@InjectModel('framework') private frameworkModel: any) {}

  // Method(service) to insert a framework
  async insertFramework(title: string, description: string) {
    let uid = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    uid = uid.replace(/-/g, "");
    uid = "blt" + uid;

    // const prodId = Math.floor(Math.random() * 10 ** 5).toString();
    // const newFramework = new Framework(prodId, title, description);
    // console.log(this.frameworkModel.findOne());
    return await this.frameworkModel.create([
      {
        uid,
        title,
        description,
      },
    ]);
  }

  async getFrameworks() {
    return await this.frameworkModel.find().exec();
  }
  
  async getSingleFramework(frameworkId: any) {
    return await this.frameworkModel.find({uid: frameworkId }).exec();
  }
  
  async updateFramework(frameworkId: string, title: string, description: string) {
    const existingFramework = await this.frameworkModel.find({uid: frameworkId }).exec();
    
    const updatedFramework = existingFramework;
    if (title) {
      updatedFramework.title = title;
    }
    if (description) {
      updatedFramework.description = description;
    }
    
    return await this.frameworkModel.findOneAndUpdate({uid: frameworkId}, updatedFramework).exec();
  }
  
  async removeFramework(frameworkId: string) {
    return await this.frameworkModel.findOneAndDelete({uid: frameworkId }).exec();
  }

  // private findFramework(id: string): [Framework, number] {
  //   const frameworkIndex = this.frameworks.findIndex((prod) => prod.id === id);
  //   const framework = this.frameworks[frameworkIndex];
  //   if (!framework) {
  //     // NestJS will automatically throw a 404 error
  //     throw new NotFoundException('Framework not found.');
  //   }
  //   return [framework, frameworkIndex];
  // }
}
