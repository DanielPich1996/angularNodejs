import { Ingredient } from '../shared/ingridient.model';

export class Recipe {
    public id : string
    public name : string;
    public description : string;
    public imagePath : string;
    public ingredients: Ingredient[];

    constructor(id:string, name:string, desc:string, imagePath:string, ingredients: Ingredient[]){
        this.id = id
        this.name = name;
        this.description = desc;
        this.imagePath = imagePath;
        this.ingredients = ingredients;
    }
}