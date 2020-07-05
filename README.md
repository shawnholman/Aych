# Ayc[H]
A javascript library for writing eloquent HTML to create dynamic webpages without 
the bells and whistles of a framework.

![](https://travis-ci.com/shawnholman/Aych.svg?token=593S1dXVHUzTznXmMuYA&branch=master&status=created)

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

#### Resulting HTML
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