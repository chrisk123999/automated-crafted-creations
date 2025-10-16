import {constants} from '../../../../utils.js';
export let greaterUndeadServant = {
    name: 'Greater Undead Servant',
    version: '0.0.9',
    rules: 'legacy',
    config: [
        {
            value: 'feats',
            label: 'AUTOMATEDCRAFTEDCREATIONS.Config.Feats',
            type: 'select-many',
            default: [],
            options: () => {return constants.getFeatOptions;},
            category: 'mechanics'
        }
    ]
};