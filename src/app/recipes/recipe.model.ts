import { Ingredient } from '../shared/ingridient.model';

export class Recipe {
    public id : string
    public name : string;
    public description : string;
    public imagePath : string;
    public ingredients: Ingredient[];
    public userId: string;

    constructor(id:string, name:string, desc:string, imagePath:string, ingredients: Ingredient[], userId: string){
        this.id = id
        this.name = name;
        this.description = desc;
        this.imagePath = imagePath;
        this.ingredients = ingredients;
        this.userId = userId;
    }
}