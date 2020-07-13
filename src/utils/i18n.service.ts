import { Injectable } from '@nestjs/common';
import {StringFormat} from './string-formet.helper';
import * as fs from 'fs';
import path = require('path');

@Injectable()
export class I18nService {

    private fallbackLanguage:string;
    
    private _cache:Map<string,any> = new Map();

    private directory:string;
    
    constructor(){
        this.fallbackLanguage='en';
        this.directory=path.join(__dirname,'..','..', 'resources/i18n');
    }

    async get(lang:string,key:string,args?: ({ [k: string]: any } | string)[] | { [k: string]: any }):Promise<string> {
        lang = lang || this.fallbackLanguage;
        
        const translationResource = this.getResource(lang);
    
        let translation=this.getValueFromJSON(key, translationResource, true);
        
        if(args || (args instanceof Array && args.length > 0))
        {
            translation = StringFormat(
                translation,
                (args instanceof Array ? args || [] : [args])
              );
        }
        
        return translation;
    }

    getResource(lang:string):any {
        if (this._cache.has(lang)) {
            return JSON.parse(this._cache.get(lang));
        }

        const translation = this.fetchResourceFile(
            `${this.directory}/${lang}.json`
        );

        if (translation && !this._cache.has(lang)) {
            this._cache.set(lang, JSON.stringify(translation));
        }

        return translation;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    getValueFromJSON(key:string, json:any, fallback:boolean):string {

        let text = key.split('.').reduce((obj, i) => obj[i], json);
        
        if (!text && this.fallbackLanguage && fallback) {
          const fallbackTranslation = this.getResource(this.fallbackLanguage);
          text = this.getValueFromJSON(key, fallbackTranslation, false);
        } else if (!text) {
          text = key;
        }
    
        return text;
    }

    fetchResourceFile(resPath:string,fallback?:boolean):any {
        try {
            return JSON.parse(fs.readFileSync(resPath).toString());    
        } catch (error) {
            if(!fallback){
                return this.fetchResourceFile(`${this.directory}/${this.fallbackLanguage}.json`,true);
            }
        }
    }
}
