import { Directive, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Ingredient } from './ingridient.model';

@Directive({
  selector: '[appGraph]'
})
export class GraphDirective implements OnInit{

  constructor(private elRef: ElementRef, 
              private slService: ShoppingListService) { }
  data: {group: string, value: number}[] = []
  ingredients: Ingredient[] = []
  
  ngOnInit(){
    
    this.ingredients = this.slService.getIngredients();
    this.getData();
    this.createChart();

    this.slService.ingredientChanged.subscribe(
      (ingredients:Ingredient[]) => {
        this.ingredients = ingredients;
        this.getData();
        this.createChart();
      }
    );
  }

  getData(){

    for(let ingredient of this.ingredients){
      this.data.push({group: ingredient.name, 
                      value: ingredient.amount});
    }
  }

  createChart(){
    d3.select('svg').remove();

    const element = this.elRef.nativeElement
    const data = this.data;

    var margin = {top: 30, right: 30, bottom: 70, left: 60};
    var width = 460 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    const svg = d3.select(element).append('svg')
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(data.map(function(d) { return d.group; }))
      .padding(0.2);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

    var y = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0]);

    svg.append("g")
      .attr("class", "myYaxis")
      .call(d3.axisLeft(y));



    var u = svg.selectAll("rect").data(data)

    u.enter()
      .append("rect")
      //.merge(u)
      .transition()
      .duration(1000)
      .attr("x", function(d) { return x(d.group); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", "#69b3a2")
  } 
}
