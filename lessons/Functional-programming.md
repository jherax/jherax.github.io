![domando javascript](https://dl.dropboxusercontent.com/u/91579606/domando-js.jpg "domando la bestia")

#Temas
* [What the func!](#what-the-func)
* [Functional Programming & OOP](#functional-programming-and-oop)
* [First-Class Citizen](#first-class-citizen) (Principios del diseño funcional)
* [Funciones que retornan funciones](#funciones-que-retornan-funciones)
* [Currying](#currying)
* [Callbacks](#callbacks) (Best Practices)
* [Recursion](#recursion)

#What the Func?
Si tomamos como referencia el concepto matematico de función, tenemos que _*`y = f(x)`*_ en donde la función _*`f()`*_ recibe un argumento _*`x`*_ el cual es procesado / transformado para producir el resultado _*`y`*_

![funcion matematica](https://dl.dropboxusercontent.com/u/91579606/funciones-matematicas.png)

Una función matematica siempre produce un resultado, sin embargo en algunos lenguajes de programación podemos definir funciones que no retornan un valor, las cuales reciben el nombre de **procedimientos** o **rutinas**.

![funcion](https://dl.dropboxusercontent.com/u/91579606/function_machine.png)

Ahora pasemos a la programación. Una función puede estar vinculada o no a un **contexto** específico. Cuando una función está asociada a un objeto, ésta recibe el nombre de **método** y su contexto es el objeto en el cual esta vinculada.

```javascript
function myFunction(a, b) {
    return a<<b; //left shift
}

let context = {
    name: "David",
    myMethod: function(msg) {
        //'this' is the context
        return `${this.name} > ${msg}`;
    }
};
```

##Los métodos call, apply, bind
En JavaScript podemos inyectar explícitamente el contexto de una función a través de los métodos [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), [call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) y [apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply), definidos en el prototipo del constructor [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).

Definamos los procedimientos que vamos a probar...

```javascript
"use strict";

function testFunction() {
    console.log("Function", this); //context
}

/**
 * See how it is transpiled
 * http://ow.ly/oGPL304tOpr
 */
const testArrow = () => {
    console.log("Arrow", this); //context
};

let context1 = {
    name: "David",
    alias: "jherax",
    testFunction,
    testArrow
};

let context2 = {
    name: "Kakarotto",
    alias: "goku"
};
```

... ahora probemos a cambiar los contextos de ejecución.

```javascript
let demo = {
    first: function() {
        testFunction();
        testArrow();
    },
    second: function() {
        context1.testFunction();
        context1.testArrow();
    },
    third: function() {
        testFunction.call(context2);
        testArrow.apply(context2);
    },
    fourth: function() {
        context1.testFunction.call(context2);
        context1.testArrow.apply(context2);
    },
    last: function() {
        let context3 = { name: "another stuff" };
        let fnBound = testFunction.bind(context3);
        fnBound();
    }
};
```

![let me see](https://dl.dropboxusercontent.com/u/91579606/temp/hmm.jpg)

#Functional Programming and OOP
La programación funcional tiene mucho que ver con la transformación de datos de forma transparente, tal cual como su concepción matetmática _*`y = f(x)`*_, una funcion toma datos de entrada, los procesa y produce un resultado, lo cual permite el encadenamiento de procesos _(pipeline)_.

![pipeline de funciones](https://dl.dropboxusercontent.com/u/91579606/functions-pipeline.jpg "pipeline")

![fp and oop](https://dl.dropboxusercontent.com/u/91579606/temp/tabla-blog-011.png)

#First-Class Citizen

En ciencias de la computación se dice que un lenguaje de programación posee **funciones de primera clase** cuando trata sus _funciones como [first-class citizens](https://en.wikipedia.org/wiki/First-class_function) (1960s),_ pero qué significa esto?

Veamos algunas de sus características:
- permite pasar funciones como argumentos a otras funciones
- permite retornar funciones como valor
- permite asignar funciones como variables
- permite almacenar funciones en estructuras de datos
- soporta funciones anónimas _(function literals)_
- poseen transparencia referencial

En el estilo de programación funcional, es frecuente ver el uso de [higher-order functions](https://en.wikipedia.org/wiki/Higher-order_function), las cuales toman una o más funciones como argumentos o retornan una función como su resultado.

```javascript
"use strict";
function map(projection, array) {
    let results = [];
    array.forEach((item) => {
        results.push(projection(item));
    });
    return results;
}
```

```javascript
var list = [{
    id: 12345,
    quantity: 10
}, {
    id: 12346,
    quantity: 15
}, {
    id: 12765,
    quantity: 12
}];

var ids = map((item) => item.id, list);
//list.map((item) => item.id)
//Reto: escribir la implementacion de forEach()
```

Ahora usamos el metodo nativo Array.prototype.map()

```javascript
var squirt = [1, 4, 9, 16, 25].map((val) => Math.sqrt(val));

//usando la transparencia referencial
const sqrt = (v) => Math.sqrt(v);
squirt = [1, 4, 9, 16, 25].map(sqrt);

var npow = [1, 2, 3, 4, 5].map(Math.pow);
```

Veamos otro ejemplo:

```javascript
"use strict";

//higher-order function
function twice (fn, value) {
    return fn(fn(value));
}

const fnAdd5 = (v) => v + 5;

twice(fnAdd5, 7); //17
twice(fnAdd5, 4); //14

//Reto: hacer que la constante 5 sea dinámica
```

#Funciones que retornan funciones

Como lo mencionamos anteriormente, en el estilo de programacion funcional existen las llamadas [Higher-order functions](http://eloquentjavascript.net/05_higher_order.html#h_xxCc98lOBK), las cuales son funciones que operan sobre otras funciones, ya sea tomándolas como argumentos o retornándolas.

Las _higher-order functions_ nos permiten abstraer sobre acciones y no solo sobre valores.

```javascript
function parse(action) {
    return function(value) {
        return action(value);
    }
}

const truthy = parse(Boolean);
let x = truthy("0");
```

[First-class and higher-order functions](https://en.wikipedia.org/wiki/Functional_programming#First-class_and_higher-order_functions).

![fascinante](https://dl.dropboxusercontent.com/u/91579606/temp/fascinating.gif)

#Currying

Algunos dicen que es una de esas técnicas avanzadas para ser un JavaScript ninja, pero lo cierto es que el _currying_ es una técnica básica de la programación funcional que proviene de [Haskell](https://www.haskell.org/). Veamos donde tiene su origen:

**`λ Function`** se origina de un sistema matemático llamado **`λ Calculus`** el cual trata de simplificar expresiones matematicas a **expresiones lambda**, es decir: `cube(x) = x * x * x` puede ser simplificado así `(x) → x * x * x` ... pero sólo puede tener 1 argumento. Para manejar una función con múltiples parámetros es necesario ir a través de ...

> ###Currying (n.)
> Una técnica que transforma una función con múltiples argumentos de tal forma que puede ser llamada como una cadena de funciones, cada una con un solo argumento.

Entonces podemos decir que `(x, y) → x + y` se puede transformar en `x → (y → x + y)`

```javascript
// una funcion de multiples argumentos...
function f(x, y) {
    return x + y;
}

// se puede transformar a una cadena de funciones,
// y cada una solo recibe un argumento
function g(x) {
    return function(y) {
        return x + y;
    };
}

// podemos decir que...
f(1,2) === g(1)(2);
```

Ya que las funciones son _first-class citizens_ y [higher-order functions](http://eloquentjavascript.net/05_higher_order.html#h_xxCc98lOBK) podemos tomar uno ejemplo anterior para adaptarlo a la version _curried_

```javascript
"use strict";

//higher-order function
function twice (action) {
    //currying takes place
    return function compute(value) {
        return action(action(value));
    };
}

const pow = (x) => x * x;
const powpow = twice(pow);
powpow(3); //81

//one-liner
twice((x) => x * x)(3); //81
```

##Tip

Podemos usar el método [.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) para hacer algo similar al _currying_ de funciones, ésta técnica es llamada **partial application**.

> El método `bind()` crea una nueva función que cuando es llamada, estabece el contexto `this` de la nueva función, y puede establecer una secuencia de argumentos estáticos cuando la nueva funcion es invocada.

```javascript
function f(x, y, z) {
    return x + y + z;
}

let x = 10, y = 3;
const f2 = f.bind(null, x, y);

f2(5); //18

//Reto: implementar la version curried de f
```

El proceso reverso de hacer _currying_ se llama _**uncurrying**_ y lo podemos lograr a través del método [.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

<img src="https://dl.dropboxusercontent.com/u/91579606/temp/lambda.png" alt="lambda" width="100"/>

#Callbacks

JavaScript es un lenguaje de programación **single-threaded** y como resultado los programadores deben usar mecanismos asíncronos que permitan mantener la aplicación _responsive_ a la interacción del usuario mientras se siguen ejecutando otras tareas, como peticiones al servidor _(fetching data)_ y pintar elementos en la UI.

##Buenas Prácticas:
- Abstraer y Modularizar
- Single Responsability Principle
- DRY (Don't Repeat Yourself)
- Bajo Acoplamiento
- Evitar el uso de variables globales
- Evitar crear funciones anonimas
- Evitar crear funciones en iteraciones

En el siguiente _snippet_ tenemos un bloque de código en donde podemos identificar un patrón:

```javascript
var unicornEl = document.getElementById('unicorn');
unicornEl.className += ' magic';
spin(unicornEl);

var fairyEl = document.getElementById('fairy');
fairyEl.className += ' magic';
sparkle(fairyEl);

var kittenEl = document.getElementById('kitten');
kittenEl.className += ' magic';
rainbowTrail(kittenEl);
```

Podemos refactorizarlo de la siguiente manera:

```javascript
function configureAction(id, action) {
    var element = document.getElementById(id);
    element.className += ' magic';
    action(element);
}

configureAction('unicorn', spin);
configureAction('fairy', sparkle);
configureAction('kitten', rainbow);
```

#Recursion

```javascript
function flatten(arr) {
    return arr.reduce(function (flattened, cv) {
        return flattened.concat(Array.isArray(cv) ? flatten(cv) : cv);
    }, []); // initial value of flattened array
}

var array = [[1], [2], [3, 4], [['a', 'b'], [['c'], 'd']], 9];
flatten(array);
```

![functional programming super cool](https://dl.dropboxusercontent.com/u/91579606/temp/psychedelic-reindeer.gif "FP super cool!")
