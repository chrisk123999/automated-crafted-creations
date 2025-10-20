import {itemUtils} from '../../../../../utils.js';
async function added({trigger: {entity: item}}) {
    await itemUtils.fixScales(item);
}
export let paralyzingTouch = {
    name: 'Paralyzing Touch',
    version: '0.0.9',
    rules: 'legacy',
    item: [
        {
            pass: 'created',
            macro: added,
            priority: 50
        },
        {
            pass: 'itemMedkit',
            macro: added,
            priority: 50
        },
        {
            pass: 'actorMunch',
            macro: added,
            priority: 50
        }
    ],
    config: [
        {
            value: 'classIdentifier',
            label: 'CHRISPREMADES.Config.ClassIdentifier',
            type: 'text',
            default: 'grave-warden',
            category: 'homebrew',
            homebrew: true
        },
        {
            value: 'scaleIdentifier',
            label: 'CHRISPREMADES.Config.ScaleIdentifier',
            type: 'text',
            default: 'paralyzing-touch-uses',
            category: 'homebrew',
            homebrew: true
        }
    ],
    scales: [
        {
            classIdentifier: 'classIdentifier',
            scaleIdentifier: 'scaleIdentifier',
            data: {
                type: 'ScaleValue',
                configuration: {
                    identifier: 'paralyzing-touch-uses',
                    type: 'number',
                    distance: {
                        units: ''
                    },
                    scale: {
                        6: {
                            value: 1
                        },
                        14: {
                            value: 2
                        }
                    }
                },
                value: {},
                title: 'Paralyzing Touch Uses',
                hint: ''
            }
        }
    ]
};