import {H} from "../src/H";
import {expect} from 'chai';
import {Aych} from "../src/core/Aych";

function removeSpace(str: string): string {
    return str.split('\n').map((line) => line.trim()).join('');
}

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

        const resultingHTML = removeSpace(`
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

        const resultingHTML = removeSpace(`
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
});