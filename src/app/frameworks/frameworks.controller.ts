import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { FrameworksService } from "./frameworks.service";

@Controller("frameworks")
export class FrameworksController {
    // adding `private` accessor so that equally named properties are created automatically for this class.
    // `readonly` lets you never replace the existing framework service with the new one.
    constructor(private readonly frameworksService: FrameworksService){

    }
    @Post()
    addFramework(
        // @Body() completeBody: {title: string, description: string},
        @Body("title") prodTitle: string,
        @Body("description") prodDescription: string,
    ): any {
        const generatedResponse = this.frameworksService.insertFramework(prodTitle, prodDescription);

        return {
            id: generatedResponse
        };

    }
    
    @Get()
    getAllFrameworks(){
        return this.frameworksService.getFrameworks();
    }

    @Get(":id")
    getFramework(@Param("id") prodId: any){
        return this.frameworksService.getSingleFramework(prodId);
    }

    @Patch(":id")
    updateFramework(
        @Param("id") prodId: string,
        @Body("title") prodTitle: string,
        @Body("description") prodDescription: string,
    ){
        return this.frameworksService.updateFramework(prodId, prodTitle, prodDescription)
    }

    @Delete(":id")
    deleteFramework(@Param("id") prodId: string){
        return this.frameworksService.removeFramework(prodId);
    }
}