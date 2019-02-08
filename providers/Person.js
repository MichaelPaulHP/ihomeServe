'use strict';
class Person{
    constructor(age=0){
        this.age=age;
    }
    getAge(){
        return this.age;
    }
    incrementAge(){
        this.age++;
    }
    toString(){
        return "Age: "+this.age;
    }

}
module.exports=new Person();