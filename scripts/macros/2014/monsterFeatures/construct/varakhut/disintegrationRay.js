import {constants, genericUtils, itemUtils} from '../../../../../utils.js';
async function use({trigger, workflow}) {
    if (!workflow.failedSaves.size || !workflow.activity) return;
    let sourceEffect = workflow.activity.effects[0]?.effect;
    if (!sourceEffect) return;
    let effectData = genericUtils.duplicate(sourceEffect.toObject());
    effectData.origin = sourceEffect.uuid;
    effectData.duration = itemUtils.convertDuration(workflow.activity);
    await Promise.all(workflow.failedSaves.map(async token => {
        if (!token.actor) return;
        await Promise.all(token.actor.items.map(async item => {
            if (!constants.itemTypes.includes(item.type)) return;
            if (item.system.properties?.has('mgc')) return;
            let effect = itemUtils.getEffectByIdentifier(item, 'disintegrationRayEffect');
            if (effect) return;
            await itemUtils.enchantItem(item, effectData);
        }));
    }));
}
export let disintegrationRay = {
    name: 'Disintegration Ray (6th Level Spell)',
    rules: 'legacy',
    version: '0.0.11',
    monsters: [
        'Varakhut'
    ],
    midi: {
        item: [
            {
                pass: 'rollFinished',
                macro: use,
                priority: 51
            }
        ]
    },
    config: [
        {
            value: 'playAnimation',
            label: 'CHRISPREMADES.Config.PlayAnimation',
            type: 'checkbox',
            default: true,
            category: 'animation'
        }
    ]
};