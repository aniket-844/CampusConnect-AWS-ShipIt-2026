export const clean=(value:unknown,max=1000)=>typeof value==='string'?value.trim().replace(/[\u0000-\u001f\u007f]/g,'').slice(0,max):'';
export const validEnum=<T extends string>(value:unknown,allowed:readonly T[]):value is T=>typeof value==='string'&&allowed.includes(value as T);
export const requireText=(v:unknown,name:string,min=1,max=1000)=>{const s=clean(v,max);if(s.length<min)throw Object.assign(new Error(`${name} must contain at least ${min} characters.`),{statusCode:400});return s};
