import {H} from "../src/H";
import {expect} from 'chai';
import {Aych} from "../src/core/Aych";
import {removeSpaces} from "../src/Util";

const data = {
    badge: {
        isActive: false,
    },
    user: {
        name: 'Shawn Holman',
        email: 'the.ikick@gmail.com',
        points: 0,
        application: {
            school: 'UGA',
            grade: 'Freshman',
            hometown: 'Hinesville',
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

describe('Integration Testing', () => {
    it('renders a complex flow of nested elements', () => {
        const popup = H.div('#popup-container',
            H.div('.veil'),
            H.div('.scanning-popup-scan',
                H.div('.header.container-fluid',
                    H.div('#description.col.col-xs-7.col-sm-6.col-md-6',
                        H.strong('{{category}}:'),
                        H.span('{{text}}')
                    ),
                    H.div('#status-indicator.col.col-xs-7.col-sm-6.col-md-6',
                        H.strong('Status:'),
                        H.div('Initializing')
                    )
                ),
                H.div('.video-container',
                    H.div('.status'),
                    H.video('#scan', { autoplay: 'autoplay' })
                )
            )
        ).render({category: 'Baseball', text: 'This is cool' });

        const resultingHTML = removeSpaces(`
            <div id="popup-container">
                <div class="veil"></div>
                <div class="scanning-popup-scan">
                    <div class="header container-fluid">
                        <div id="description" class="col col-xs-7 col-sm-6 col-md-6">
                            <strong>Baseball:</strong>
                            <span>This is cool</span>
                        </div>
                        <div id="status-indicator" class="col col-xs-7 col-sm-6 col-md-6">
                            <strong>Status:</strong>
                            <div>Initializing</div>
                        </div>
                    </div>
                    <div class="video-container">
                        <div class="status"></div>
                        <video id="scan" autoplay="autoplay"></video>
                    </div>
                </div>
            </div>
        `);
        expect(popup).to.equal(resultingHTML);
    });

    it('conditionally renders a div inside of a loop', () => {
        const animals = ['Dog', 'Cat', 'Cow', 'Mouse', 'Horse', 'Pig', 'Hog', 'Bird', 'Squirrel', 'Monkey', 'Ant'];
        const animalList = H.$each(animals, (animal: string) =>
            H.$if(animal.length > 3,
                H.div(
                    H.span('Animal: {{animal}}'),
                    H.span('Number of Letters: ', H.string(animal.length))
                )
            )
        ).setItemName('animal').render();

        const resultingHTML = removeSpaces(`
            <div>
                <span>Animal: Mouse</span>
                <span>Number of Letters: 5</span>
            </div>
            <div>
                <span>Animal: Horse</span>
                <span>Number of Letters: 5</span>
            </div>
            <div>
                <span>Animal: Bird</span>
                <span>Number of Letters: 4</span>
            </div>
            <div>
                <span>Animal: Squirrel</span>
                <span>Number of Letters: 8</span>
            </div>
            <div>
                <span>Animal: Monkey</span>
                <span>Number of Letters: 6</span>
            </div>
        `);

        expect(animalList).to.equal(resultingHTML);
    });

    it('it uses composes, custom pipes and statements all together to render a complex HTML block', () => {
        Aych.compose('row', (...insides) =>
            H.div('.row',
                H.div('.col',
                    H.strong(insides[0]),
                    H.unescaped(": " + insides[1])
                )
            )
        );

        Aych.Piper.register('unCamelCase', (str) => {
            return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());
        });

        const row = H.div('.row.view-badge-info',
            H.$if(!data.badge.isActive,
                H.div('.row.text-center.inactive-badge', 'Disabled Badge')
            ),
            H.div('.col.col-xs-7.col-sm-7.col-md-7.text-left',
                H.row('Name', data.user.name),
                H.row('Email', data.user.email),
                H.row('Points', data.user.points || 0),
                H.$eachIn(data.user.application, ([name, value]) =>
                    H.row(
                        H.string('{{name|unCamelCase}}').render({name}),
                        value || 'None'
                    )
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
        ).r;

        const resultingHTML = removeSpaces(`
            <div class="row view-badge-info">
                <div class="row text-center inactive-badge">Disabled Badge</div>
                <div class="col col-xs-7 col-sm-7 col-md-7 text-left">
                    <div class="row">
                        <div class="col">
                            <strong>Name</strong>: Shawn Holman
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <strong>Email</strong>: the.ikick@gmail.com
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
                            <strong>Hometown</strong>: Hinesville
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
        `);
        expect(row).to.equal(resultingHTML);
    });

    it('it uses composes, custom pipes statements, and templates all together to render a complex HTML block', () => {
        const row = H.div('.row.view-badge-info',
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

        const resultingHTML = removeSpaces(`
            <div class="row view-badge-info">
                <div class="row text-center inactive-badge">Disabled Badge</div>
                <div class="col col-xs-7 col-sm-7 col-md-7 text-left">
                    <div class="row">
                        <div class="col">
                            <strong>Name</strong>: Shawn Holman
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <strong>Email</strong>: the.ikick@gmail.com
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
                            <strong>Hometown</strong>: Hinesville
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
        `);
        expect(row).to.equal(resultingHTML);
    });

    it('scopes Aych and uses switches and groups to render an HTML page', () => {
        const element = H.$(({ $switch, $case, $group, $repeat, div, input, html, body, title, head }) => {
            const type = 'password';
            return html(
                head(
                    title('Some Title'),
                ),
                body(
                    // Useless group
                    $group(
                        div({ id: [type !== 'password', 'someid'] }, 'Test Div'),
                        div({ class: [type === 'password', '+password', '+none']}, 'Test Div w/ Class')
                    ),
                    $switch(type,
                        $case('text', input({ type: 'text' })),
                        $case('password', input({ type: 'password' })),
                        $case('hidden', input({ type: 'hidden' }))
                    ),
                    // Technically we can just write:
                    input({ type }),
                    $repeat(10, (i: number) => {
                        return div('#div' + i, {class:[i >= 5, '+above', '+below']});
                    })
                )
            )
        });

        const resultingHTML = removeSpaces(`
            <html>
                <head>
                    <title>Some Title</title>
                </head>
                <body>
                    <div>Test Div</div>
                    <div class="password">Test Div w/ Class</div>
                    <input type="password">
                    <input type="password">
                    <div id="div0" class="below"></div>
                    <div id="div1" class="below"></div>
                    <div id="div2" class="below"></div>
                    <div id="div3" class="below"></div>
                    <div id="div4" class="below"></div>
                    <div id="div5" class="above"></div>
                    <div id="div6" class="above"></div>
                    <div id="div7" class="above"></div>
                    <div id="div8" class="above"></div>
                    <div id="div9" class="above"></div>
                </body>
            </html>
        `);
        expect(element).to.equal(resultingHTML);
    });

    it('makes a table using a composable', () => {
        Aych.compose("createTable", (tableData) => {
            const { table, $each, $if, tr, td, th } = H;

            return table(
                $each(tableData, (row, rowCount) =>
                    tr(
                        $each(row,
                            $if(rowCount == 0, th('{{item}}')).else(td('{{item}}'))
                        )
                    )
                )
            );
        });
        const table = H.createTable([
            ['Name', 'Title', 'Hometown'],
            ['Shawn', 'Director', 'Hinesville, GA'],
            ['Jim', 'SWE', 'Savannah, GA'],
            ['Carla', 'SWE', "Atlanta, GA"]
        ]).r;

        const resultingHTML = removeSpaces(`
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Title</th>
                        <th>Hometown</th>
                    </tr>
                    <tr>
                        <td>Shawn</td>
                        <td>Director</td>
                        <td>Hinesville, GA</td>
                    </tr>
                    <tr>
                        <td>Jim</td>
                        <td>SWE</td>
                        <td>Savannah, GA</td>
                    </tr>
                    <tr>
                        <td>Carla</td>
                        <td>SWE</td>
                        <td>Atlanta, GA</td>
                    </tr>
                </table>
           `)
        expect(table).to.equal(resultingHTML);
    })
});