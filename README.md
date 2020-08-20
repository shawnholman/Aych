# Ayc[H]
A javascript library for writing eloquent HTML to create dynamic webpages without 
the bells and whistles of a framework.

![build](https://travis-ci.com/shawnholman/Aych.svg?token=593S1dXVHUzTznXmMuYA&branch=master&status=created)
[![coverage](https://img.shields.io/codecov/c/github/shawnholman/aych/master?token=XLW5V9O2CF)](https://codecov.io/gh/shawnholman/Aych)
[![Maintainability](https://api.codeclimate.com/v1/badges/b154a8ee535354814515/maintainability)](https://codeclimate.com/github/shawnholman/Aych/maintainability)
## Overview
Writing HTML inside of JavaScript has been a pain for many years for myself. With today’s 
technologies, you are either stuck with a blob of HTML inside of your JavaScript, you rely 
on heavy templating engines that hardly make anything better, or you use a framework. 
Aych solves a decade old problem in a new way and 
make dynamic HTML independent of large frameworks that do the heavy lifting. Aych provides
a micro-library to facilitate writing eloquent HTML inside of JavaScript. 
It’s that simple, but very powerful.

## Example Usage
The following is an example of one way Aych can be used. See the `tests` folder for a comprehensive set of examples.
#### Using Aych:
```javascript
H.div('#example.row.view-badge-info',
    H.$if(!data.badge.isActive,
        H.div('.row.text-center.inactive-badge', 'Disabled Badge')
    ),
    H.div('.col.col-xs-7.col-sm-7.col-md-7.text-left',
        H.row('Name', '{{user.name}}'),
        H.row('Email', '{{user.email}}'),
        H.row('Points', '{{user.points}}'),
        H.$eachIn(data.user.application,
            H.row('{{item[0]|unCamelCase}}', '{{item[1]}}')
        )
    ),
    H.div('.col.col-xs-5.col-sm-5.col-md-5.text-right',
        H.$eachIn(data.user.is, ([name, value]) =>
            H.row(
                H.string('{{name|unCamelCase}}').render({name}),
                H.span('.permission-circle', {class: [value, '+granted', '+denied']})
            )
        )
    )
).render(data);
```
#### where the data are:
```javascript
const data = {
    badge: {
        isActive: false,
    },
    user: {
        name: 'John Doe',
        email: 'john doe@gmail.com',
        points: 0,
        application: {
            school: 'UGA',
            grade: 'Freshman',
            hometown: 'City',
            gradePointAverage: '4.0',
        },
        is: {
            admin: false,
            volunteer: true,
            organizer: true,
            owner: false,
        },
    },
};
```
#### results in the following html:
```html
<div id="example" class="row view-badge-info">
    <div class="row text-center inactive-badge">Disabled Badge</div>
    <div class="col col-xs-7 col-sm-7 col-md-7 text-left">
        <div class="row">
            <div class="col">
                <strong>Name</strong>: John Doe
            </div>
        </div>
        <div class="row">
            <div class="col">
                <strong>Email</strong>: johndoe@gmail.com
            </div>
        </div>
        <div class="row">
            <div class="col">
                <strong>Points</strong>: 0
            </div>
        </div>
        <div class="row">
            <div class="col">
                <strong>School</strong>: UGA
            </div>
        </div>
        <div class="row">
            <div class="col">
                <strong>Grade</strong>: Freshman
            </div>
        </div>
        <div class="row">
            <div class="col">
                <strong>Hometown</strong>: Atlanta
            </div>
        </div>
        <div class="row">
            <div class="col">
                <strong>Grade Point Average</strong>: 4.0
            </div>
        </div>
    </div>
    <div class="col col-xs-5 col-sm-5 col-md-5 text-right">
        <div class="row">
            <div class="col">
                <strong>Admin</strong>: <span class="permission-circle denied"></span>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <strong>Volunteer</strong>: <span class="permission-circle granted"></span>
            </div>
        </div>
        <div class="row">
                <div class="col"><strong>Organizer</strong>: <span class="permission-circle granted"></span>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <strong>Owner</strong>: <span class="permission-circle denied"></span>
            </div>
        </div>
    </div>
</div>
```
   
## Downloading
In order to use Aych, download [aych.min.js](https://github.com/shawnholman/Aych/tree/master/dist) from the dist folder and load with:
```html
<script type="text/javascript" src="aych.min.js"></script>
```

# Documentation
Aych is a library that is meant to stay slim and simple. This documentation should give you a good understanding of 
Aych.

* [Globals](#globals)
    - [Conflict](#conflict)
* [Renderable](#renderable)
* [Tags](#tags)
	- [Attributes](#attributes)
	    - [Identifier String](#identifier-string)
	    - [Other Attributes](#other-attributes)  
	- [Empty Elements](#empty-elements)
	- [Nestable Elements](#nestable-elements)
	- [String Literals](#string-literals)
* [Rendering](#rendering)
    - [.render(templates, options)](#rendertemplates-options)
        - [Templating](#templating)
        - [Options](#options)
    - [.r](#r)
    - [.toString()](#tostring)
* [Piper](#piper)
* [Statements](#statements)
    - [$](#-scope)
    - [$if](#if)
    - [$each](#each)
    - [$eachIn](#eachin)
    - [$repeat](#repeat)
    - [$group](#group)
    - [$switch / $case](#switch--case)
* [More Examples](#more-examples)
	    

## Globals
To start off, Aych has two exposed globals: `Aych` and `H`. These are homonyms. `Aych` is the core of the library 
while `H` is an instantiation of `Aych`. Their purposes are different, though.

`Aych` is used to:
1. Add/Remove Tags
2. Add/Remove Compositions
2. Access Piper

`H` is used to:
1. Create HTML Tags
2. Call Statements

### Conflict
Because `H` is just an instantiation of `Aych`, you can easily reassign it. Likewise, you can reassign `Aych` itself.

## Renderable
The term renderable is very important in understanding the rest of the documentation. A renderable is the foundational 
logic for renderable child class to inherit and use. A renderable, conceptually, is a class that has a render method 
that can be called to get a string representation of that class. Almost all functions under `H` will return a 
renderable which supports the following API:

* render(templates, options): Renders a renderable with templates and options set.
* with(templates): Sets the templates of the renderable
* when (condition): Turns on and off renderability of the renderable.
* get r(): Getter that calls the render method without templates or options. 
* toString(): Called when the renderable is converted to a string. Also calls the render method without templates or 
options. 

## Tags
At the core of Aych, you want to be able to create HTML Tags. These tags follow the same naming conventions as the HTML
tags themselves and live under `H`.

For example:
```javascript
H.span().r; 
```
Produces:
```html
<span></span>
```

`H.span()` returns a renderable and such needs to be resolved to a string using one of three ways to render:
1. .render();
2. .r; **(unsed in the example above)**
3. .toString(); (or anything that would cause toString to automatically call such as `+ ""`;

More on rendering later.

Of course, HTML is a bit more complicated than a single span. This section will cover how to add attributes and 
children to the elements.

## Attributes
There are many attributes in HTML but are all formatted similarly. We wanted to give a simple and easy way to add 
attributes while adding control.

### Identifier String
The first thing we discovered about HTML, is that by far the most used attributes are `id` and `class`. For this reason
we developed the identifier string which dissolves into these two attributes.

The identifier string is a string you apply to the first parameter of any element. The string itself should either
start with a `#` (for id) or `.` (for class) and be followed up by 0 or more class names. If an id is specified, it 
must come first.

**Identifier string should always be defined as the first parameter, but it's not require.**

Valid:
```javascript
H.span("#example.hello.world"); 
```
Produces:
```html
<span id="example" class="hello world"></span>
```

Invalid:
```javascript
H.span("example.hello.world"); // does not start with "#" or "."
H.span(".hello.world#example"); // id should come first
```

In fact, those invalid examples would actually register the string as a literal which will result in this:
```html
<span>example.hello.world</span>
<span>.hello.world#example</span>
```


### Other attributes
Every other attribute can be given in an object either in place of the identifier string or afterwards.

**This list should always come after the identifier string (if used) and before children.**

The following examples gives some cools ways that the attribute object can be used to help manipulate attributes.

For example:
```javascript
H.span("#example.hello.world", {
    // Add the style attribute with given value.
    "style": "color: red",
      
    // Append / remove classes (remove with '-' instead of '+')
    "class": '+awesome',

    // Add an attribute with a conditional value.
    "lang": [true, "en-US", 'en-UK'],

    // Conditionally append/remove classes
    "class": [false, '+cool', '-world'],
  
    // Includes attribute:
    "title": [true, "a span"],
 
    // Excluse attribute
    "data-attr": [false, "value"],
}); 
```
Produces:
```html
<span id="example" class="hello awesome" style="color: red;" lang="en-US" title="a span"></span>
```


### Empty Elements
An empty element cannot have nested elements inside of it. An example of this is the HTML tag: `input`. The tag cannot
accept children. Empty elements in Aych should be treated the same way.

```javascript
H.input().r; 
```
Produces:
```html
<input>
```


### Nestable Elements
A nestable element can have nested elements inside of it. The majority of HTML tags are nestable like: `span`, `div`,
`strong`, etc.

For example:
```javascript
H.span(H.div(), H.strong()).r; 
```
Produces:
```html
<span><div></div><strong></strong></span>
```

In this case, we have `div` and `strong` tags nested inside of the single span. This is reflected in Aych by using the
power of variable arguments. We could add any number of elements within these parentheses. 

This more complex example:
```javascript
H.span(".class1", { "data-value": "somevalue" },
    H.div(H.strong("#id.class2", "Hi")), 
    H.strong(H.div(H.strong("Buddy")))
).r; 
```
Produces:
```html
<span class="class1" data-value="somevalue">
    <div><strong id="id" class="class2">Hi</strong></div>
    <strong><div><strong>Buddy</strong></div></strong>
</span>
```

As you can see, the parameters for every attribute is flexible and follows these rules:
1. Identifier string has to be the first parameter and valid. Otherwise, it will be a literal.
2. Attribute has to follow identifier string but preceed children. 
3. Children must come after identifier string and attributes.

`1` is very important because a malformed identifier string could lead to unexpected errors as it would be treated
as a child meaning that attributes followed by a child would lead to this error.

Maybe you can also tell that the children were not explicitly rendered using '.r'. Only the `span` is rendered. 
This is by design as rendering bubbles down to the children. In fact, rendering the children will cause unexpected 
results because the string returned by ".r" would be read as a literal, and the HTML produced by it escaped by the
parent.

### String Literals
Aych supports printing string literals within tags. Any stringable type can be used as a string literal including 
numbers and arrays.

String literals can be used directly in Aych as children as they are considered renderable. You can also use 
`Aych.string()` to create a string literal. String literals should not contain any HTML as it will be escaped 
automatically. If you would like a string literal that does not have this functionality, you can use `Aych.unescape()` 
in place of using a string literal or `Aych.string()`.

These string literals also support a simple templating that can pull data from the templates passed in through
the render method. More on that in the render section. However, this would look like this:

```javascript
H.string("{{name}}").render({ name: 'John' }); // output: "John"
```

## Rendering
Rendering in aych is the process of turning a function into it's HTML equivalence. Rendering can be done in three ways:

1. .render(templates, options)
2. .r
3. .toString();

### .render(templates, options);
The most powerful way to render is with the `render` method which allows you to pass in templates and options for the
rendering. Template data can be used inside of string literals to conveniently access data.

#### Templating
Aych supports a very simple templating. One of the design goals was to keep this engine very simple. It supports 
accessing data from the templating object, and it also supports piping. See the piping section for details.

You can access data inside of the template string using the `{{ }}` operators with the name of the data location. Aych
supports accessing nested objects and arrays.

```javascript
H.div("{{name.first[0]}} {{name.last[1]}}").render({ 
    name: {
        first: ['John', 'Billy'],
        last: ['Hanks', 'Doe']
    } 
}); // output: "<div>John Doe</div>"
```

As mentioned, there is also support for piping, or transforming the data using the pipe operator (`|`):
```javascript
H.div("{{name.first[0]|uppercase}} {{name.last[1]|substr(0, 1)}}").render({ 
    name: {
        first: ['John', 'Billy'],
        last: ['Hanks', 'Doe']
    } 
}); // output: "<div>JOHN d</div>"
```

As you can see, pipes can even have parameters! The substr pipe is using `String.prototype.substr`.

#### Options
The options are part of an interface called the RenderOptions. You can checkout the API for details on each option.

### .r
The `.r` getter calls the `.render()` method without any templates or options.

```javascript
H.div().r; // output: "<div></div>"
```

### .toString()
```javascript
H.div() + ""; // output: "<div></div>"

// equivalent to:
H.div().toString();
```

## Custom Tags/Compositions
Aych wants to remain flexible which means allowing developers to extend the library. Aych makes this possible through
the `Aych.create()` and `Aych.compose()`.

### Aych.create()
`Aych.create()` allows you to define custom HTML tags to be used within H. You create a tag by specifying whether it's
nestable or empty and then naming it. These tags can be used just like any other renderable in Aych.

```javascript
// TODO: Reverse this order, name should come first to be consistent with compose.
Aych.create(Aych.ElementType.NESTED, 'custom');
Aych.create(Aych.ElementType.EMPTY, 'custom-element');

H.custom("#id").r; // output: <custom id="id"></custom>
H.customElement().r // output: <custom-element></custom-element>
```

**Note: The name of the tag should be a valid HTML tag name.**

### Aych.compose()
In Aych, a composition is a reusable set of HTML elements. A composition is created using the `compose` method under
`Aych`. The first parameter is the name of the composition while the second parameter is an anonymous function that 
should return the renderable that represents the composition. The arguments injected into the anonymous function
will correspond to the arguments used in the composition call.

```javascript
Aych.compose('row', (title, value) =>
    H.div('.row',
        H.div('.col',
            H.strong(title),
            H.unescaped(': ' + value)
            // If 'value' is a renderable then the concatination between ': ' and 'value' will cause 
            // 'value' to automatically render resulting in HTML (see the .toString() section). 
            // Without unescaped, the parent div would escape these HTML characters giving unexpected results.
        )
    )
);

H.row("Name", H.span("John Doe")).r;
```
Produces:
```html
<div class="row">
    <div class="col">
        <strong>Name</strong>: <span>John Doe</span>
    </div>
</div>
```


### Aych.destroy()
You can remove tags or compositions using the `destroy` method under Aych.

```javascript
Aych.destroy('div');
// H.div().r // no longer is valid because it was removed.
```

## Piper
Piper is the piping engine for Aych. Piper lives used `Aych.Piper` and allows you to register, deregister, or update
the pipes that you can use inside of string literals during templating. Pipes can take optional arguments which can 
either be a string, number or boolean.

### Usage
Pipes are used within string literals to modify the data pass in. 

```javascript
H.string("{{text|uppercase()}}").render({ text: 'hello' });
// OR
H.string("{{text|uppercase}}").render({ text: 'hello' });
// output: HELLO
```

In the above example, the uppercase pipe takes in some text and turns it to uppercase. Using parentheses are optional
unless you want to specify parameters:

```javascript
H.string("{{text|substr(1, 3))}}").render({ text: 'hello' });
// output: ell
```

Piper does not require arguments even if you create a pipe with arguments. If you want these arguments to be required,
you will have to manually error handle the undefined arguments. See the `addLetter` example below.

### Register / Deregister Pipe
The way that you register a pipe is like this:
```javascript
Aych.Piper.register('PIPE NAME HERE', (str, optionalArg1, optionalArg2, ...) => {
    // Do something to str here.
    return str;
});
```

You can deregister a pipe using `Aych.Piper.deregister('PIPE NAME HERE')`.

Alternatively, if you simply want to update an existing pipe, you can use the update method. The signature used is 
slightly modified. The previous pipe function will be given to you as the first argument:
```javascript
Aych.Piper.update('PIPE NAME HERE', (original, str, optionalArg1, optionalArg2, ...) => {
    // Do something to str here.
    return original(str);
});
```

An example with all these concepts:
```javascript
Aych.Piper.register('addLetter', (str, letter) => {
    if (letter === undefined) letter = 'a';
    return str + letter;
});

H.div('{{text|addLetter(!)}}').render({text: "Hello"}); // output: "Hello!"
H.div('{{text|addLetter}}').render({text: "Hello"}); // output: "Helloa" (missing argument uses letter 'a')

Aych.Piper.update('addLetter', (original, str, letter) => {
    if (letter === undefined) letter = 'a';
    return letter + original(str, letter);
});

H.div('{{text|addLetter(!)}}').render({text: "Hello"}); // output: "!Hello!"

Aych.Piper.deregister('addLetter');
// Using addLetter as a pipe after this point will throw an error.
```

## Statements
Statements are special renderable's that modify the way other renderables get rendered. Statements are the power that
Aych provides to write shorter code. Statements are all under the `H` variable and are all preceeded by a dollar sign
(`$`). Again, statements are renderable so they have  `.render()` and `.r` methods and thus can be used as children just
like regular tags.

### $ (scope)
The `$` statement is called the scope statement. This statement is used to improved the readability of your Aych code
by scoping H within an anonymous function and restricting new pipes, new tags, and new creations within this anonymous 
function. 

```javascript
H.$((H) => {
   // Use H here. Any new pipes, tags, or creations that are added will be removed 
   // after this anonymous function runs.
   return H.div();
}); // output: <div></div>
```

You may notice that the anonymous function injects `H` as the first parameter. While this is not required, it is 
recommended to use destructuring to pull out the necessary tags or statements. You will also see that with this 
statement you `return` the final element construction. `.r` is optional here as the scope statement will call it
automatically. However, if you want to include templates you need to explicitly call '.render()'

Full example:
```javascript
H.$(({ $switch, $case, input, html, body, title, head }) => {
    const type = 'password';
    return html(
        head(
            title('Some Title'),
        ),
        body(
            $switch(type,
                $case('text', input({ type: 'text' })),
                $case('password', input({ type: 'password' })),
                $case('hidden', input({ type: 'hidden' }))
            ),
        )
    )
});
```
Produces:
```html
<html>
    <head>
       <title>Some Title</title> 
    </head>
    <body>
        <input type="password">
    </body>
</html>
```

Again, note that no explicit render method is required. 

### $if
Rendering HTML conditionally can prove to be extremely useful. The `$if` statement accomplishes just that.

```javascript
H.$if(true, H.div(), H.span()).r; // output: <div></div>
H.$if(false, H.div(), H.span()).r; // output: <span></span>
H.$if(false, H.div()).else(H.span()).r; // output: <span></span>

// Use else if:
H.$if(false, H.div()).elif(false, H.span()).elif(true, H.strong()).r; // output: <strong></strong>

// Nested if:
H.$if(true, 
    H.$if(false,
        H.div(),
        H.span()
    ),
    H.strong()
).r // output: <span></span>
```



### $each
The `$each` statement renders a renderable for each item in a list. The `eachIn` is similar but instead works with 
a key,value paired object.

The each statement is very powerful because it allows multiplying HTML elements based on a list.
```javascript
H.$each(['John', 'Jennifer', 'Samantha'], H.div("{{item}} @ {{i}}")).r;
// output: <div>John @ 0</div><div>Jennifer @ 1</div><div>Samantha @ 0</div>
```

As you can see, the each statement injects two special templating tags called `item` and `i` where
`item` refers to the element in the array and `i` refers to the index. You can change these names:
```javascript
H.$each(['John', 'Jennifer', 'Samantha'], H.div("{{element}} @ {{index}}"), 'index', 'element').r;
// OR
H.$each(['John', 'Jennifer', 'Samantha'], H.div("{{element}} @ {{index}}")).setIndexName('index').setIndexName('element').r;
// output: <div>John @ 0</div><div>Jennifer @ 1</div><div>Samantha @ 0</div>
```

If you need more flexibility, you can use an anonymous function that returns a renderable instead of using the
renderable directly:
```javascript
H.$each(['John', 'Jennifer', 'Samantha'], (item, index, arr) => H.div(item + " @ {{index}}")).r;
// output: <div>John @ 0</div><div>Jennifer @ 1</div><div>Samantha @ 0</div>
```

Take note that you can still use templates in this returned renderable. In fact, `item` and `index` are available, 
though including both in the example is a bit redundant. The goal was to show you the signature of this anonymous
function and what it injects.

**What happens if the list is empty?**
In case you want to have a special element used if the list is empty, you can chain on the `.empty()` method:
```javascript
H.$each([], H.div("{{item}} @ {{i}}")).empty(H.span("List empty!")).r;
// output: <span>List empty!</span>
```

### $eachIn
The `$eachIn` statement works similar to each in all aspects expect for the input of data. The data in an each in 
statement is an key,value object.

```javascript
H.$eachIn({
    "date": "08/08/2020",  
    "age": 19,
}, H.div("{{item[0]}}:{{item[1]}} @ {{i}}")).r;

//OR
H.$eachIn({
    "date": "08/08/2020",  
    "age": 19,
}, ([key, value], index) => H.div(key + ":" + value + " @ " + index)).r;

// output: <div>date:08/08/2020 @ 0</div><div>age:19 @ 1</div>
```

Just like with the `$each` statement, you can call `setIndexName`, `setItemName`, and `empty`.

### $repeat
The `$repeat` statement will copy an element some number of times.

```javascript
H.$repeat(3, H.div("I'm div number: {{i}}")).r;
// OR:
H.$repeat(3, (i) => {
    return H.div("I'm div number: " + i);
}).r;

// output: <div>I'm div number: 0</div><div>I'm div number: 1</div><div>I'm div number: 2</div>
```

### $group
The `$group` statement groups elements together for rendering.

By using a group statement, we are able to logically group a set of renderable elements. In the example below, we 
compare how to use a group statement.

```javascript
const type = 'password';
$group(
    H.div({ id: [type !== 'password', 'someid'] }, '{{age}}'),
    H.div({ class: [type === 'password', '+password', '+none']}, '{{name}}'),
    H.div("{{school}}")
).render({ age: 19, name: 'John', school: 'UGA' });
// output: <div>19</div><div class="password">John></div><div>UGA</div>

// Equivalent to:
const type = 'password';
H.div({ id: [type !== 'password', 'someid'] }, '{{age}}').render({ age:19 }) +
H.div({ class: [type === 'password', '+password', '+none']}, '{{name}}').render({ name:'John' }) +
H.div("{{school}}").render({ school: 'UGA' });
```

As you can see, in the alternative, when not using a group statement, you have repeated render calls and you have to
concat the strings together.

### $switch / $case
The `$switch` statement allows you to toggle between a set of elements based on some input. This statement is used with
the `$case` statement.

```javascript
const value = 3;
H.$switch(value,
    H.$case(0, H.div()),
    H.$case(1, H.span()),
    H.$case(2, H.strong()),
    H.$case(3, H.h1()),
).r; // output: <h1></h1>
```

Just like switch statements in JavaScript, our `$switch` statements also support a default in case when none of the 
cases are met:
```javascript
const value = "dog";
H.$switch(value,
    H.$case("cat", H.div()),
    H.$case("tiger", H.span()),
    H.$case("bear", H.strong()),
    H.$case("mouse", H.h1()),
).default(H.h2()).r; // output: <h2></h2>
```

## More examples
The tests/ folder in the github is a great place to explore test cases and uses. You will likely find
`intergration.ts` and `h.test.ts` the most interesting as they use the library directly. The subfolders 
will contain more internal testing but also serve as valuable example.