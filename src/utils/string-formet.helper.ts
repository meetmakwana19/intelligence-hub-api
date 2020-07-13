export function StringFormat(template:string, transformers:any[]):string {
    return template.replace (
        /([{}])\1|[{](.*?)(?:!(.+?))?[}]/g,(match, literal, key)=>{
            const path = key.split ('.');
            let value = (/^\d+$/.test (path[0]) ? path : ['0'].concat (path));
            value= value.reduce (function(maybe, key) {
                return maybe.reduce (function(_, x) {
                    return x != null && key in Object (x) ?
                    [typeof x[key] === 'function' ? x[key] () : x[key]] :
                    [];
                }, []);
            }, [transformers]);
            value= value.reduce (function(_, x) { return x; }, '');
            return value;
        }
    );
}
