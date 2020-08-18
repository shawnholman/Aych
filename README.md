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
In order to use Aych, download `aych.min.js` from the dist folder and load with:
```html
<script type="text/javascript" src="aych.min.js"></script>
```


# API Overview
Aych is a library that is meant to stay slim and simple. This API Overview should give you a good understanding of 
Aych.

## Globals
To start off, Aych has two exposed globals: `Aych` and `H`. These are homonyms. `Aych` is the core of the library 
while `H` is an instantiation of `Aych`. Their purposes are different, though.

`Aych` is used to:
1. Add/Remove Tag Definitions
2. Add/Remove Custom Declarations 
2. Access Piper

`H` is used to:
1. Create HTML Tags
2. Call Statements

### Conflict
Because `H` is just an instantiation of `Aych`, you can easily reassign it. Likewise, you can reassign `Aych` itself.

## Tags
At the core of Aych, you want to be able to create HTML Tags. These tags follow the same naming conventions as the HTML
tags themselves and live under `H`.

For example:
```javascript
H.span(); 
```
Produces:
```html
<span></span>
```

Of course, HTML is a bit more complicated than that. This section will cover how to write both Empty and Nestable
elements that have attributes.

### Nestable
A nestable element can have nested elements inside of it. The majority of HTML tags are nestable like: `span`, `div`,
`strong`, etc.

For example:
```javascript
H.span(H.div(), H.strong()); 
```
Produces:
```html
<span><div></div><strong></strong></span>
```

In this case, we have `div` and `strong` tags nested inside of the single span. This is reflected in Aych by using the
power of variable arguments. We could add any number of elements within these parenthesis. 

This more complex example:
```javascript
H.span(
    H.div(H.strong("Hi")), 
    H.strong(H.div(H.strong("Buddy")))
); 
```
Produces:
```html
<span>
    <div><strong>Hi</strong></div>
    <strong><div><strong>Buddy</strong></div></strong>
</span>
```


### Empty
An empty element cannot have nested elements inside of it. An example of this is the HTML tag: `input`. The tag cannot
accept children. Empty elements in Aych should be treated the same way. These elements can be declared in Aych very
similar to Nestable elements. The only difference is the exclusion of children.

```javascript
H.input(); 
```
Produces:
```html
<input>
```


## Attributes
There are many attributes in HTML but are all formatted similarly. We wanted to give a simple and easy way to add 
attributes while adding control.

### Identifier String
The first thing we discovered about HTML, is that by far the most used attributes are `id` and `class`. For this reason
we developed the identifier string which dissolves into these two attributes.

The identifier string is a string you apply to the first parameter of any element. The string itself should either
start with a `#` (for id) or `.` (for class) and be followed up by 0 or more class names. If an id is specified, it 
must come first.

**Identifier string should always preceed children.**

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
H.span("example.hello.world"); 
H.span(".hello.world#example"); 
```


### Other attributes
Every other attribute can be given in an object either in place of the identifier string or afterwards.

**Identifier string should always preceed the other attributes and children.**

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