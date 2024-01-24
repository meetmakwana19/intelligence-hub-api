import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { FrameworksService } from "./frameworks.service";

@Controller("frameworks")
export class FrameworksController {
    // adding `private` accessor so that equally named properties are created automatically for this class.
    // `readonly` lets you never replace the existing framework service with the new one.
    constructor(private readonly frameworksService: FrameworksService){

    }
    @Post()
    async addFramework(
        // @Body() completeBody: {title: string, description: string},
        @Body("title") prodTitle: string,
        @Body("description") prodDescription: string,
    ): Promise<any> {
        const generatedResponse = await this.frameworksService.insertFramework(prodTitle, prodDescription);
        
        return generatedResponse;

    }
    
    @Get()
    getAllFrameworks(){
        return this.frameworksService.getFrameworks();
    }

    @Get(":id")
    getFramework(@Param("id") uid: any){
        return this.frameworksService.getSingleFramework(uid);
    }

    @Patch(":id")
    updateFramework(
        @Param("id") uid: string,
        @Body("title") prodTitle: string,
        @Body("description") prodDescription: string,
    ){
        return this.frameworksService.updateFramework(uid, prodTitle, prodDescription)
    }

    @Delete(":id")
    deleteFramework(@Param("id") uid: string){
        return this.frameworksService.removeFramework(uid);
    }
}