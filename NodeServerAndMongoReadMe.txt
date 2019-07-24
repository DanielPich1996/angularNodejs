mongoDB->

First install MongoDB Compass from: https://www.mongodb.com/download-center/community

1. go to: C:\Program Files\MongoDB\Server\4.0\bin
2. open a PowerShell or Console in that folder
3. run ".\mongod.exe"
4. open ANOTHER PowerShell or Console window (keep the mongod on)
5. run ".\mongo.exe"
6. type the command: "use angular_course"
7. type the command: "db.recipes.insert([
{"_id":"5d31fd6659522c5b648a5cc1","name":"Burger","description":"The best one","image_path":"https://assets3.thrillist.com/v1/image/2797371/size/tmg-article_default_mobile.jpg","ingredients":{"5d31fea0a99d0534dcde6c3a":1,"5d31fe7f13c11734dc3afbbb":2}},
{"_id":"5d332ade2c9f3501d0be03c2","name":"Pasta","description":"For vegans","image_path":"https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/one_pot_chorizo_and_15611_16x9.jpg","ingredients":{"5d332b5f2c9f3501d0be03cd":5,"5d332b652c9f3501d0be03ce":10}}]
)"
8. type the command: "db.ingredients.insert([{"_id":"5d31fe7f13c11734dc3afbb1","name":"Bread"}, {"_id":"5d31fea0a99d0534dcde6c32","name":"Meat"}, {"_id":"5d332b5f2c9f3501d0be03c3","name":"Pasta"}, {"_id":"5d332b652c9f3501d0be03c4","name":"Tomats"}])"



NodeJS server->

in the angular src folder, open PowerShell or Console (can be opened from the VisualStudioCode Terminal also)
type "node server.js" to start our node server.
keep that terminal/console open.
