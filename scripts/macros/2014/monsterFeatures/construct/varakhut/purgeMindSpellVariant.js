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
        let spells = token.actor.items.filter(item => item.type === 'spell' && !itemUtils.getEffectByIdentifier(item, 'purgeMindSpellVariantEffect'));
        if (!spells.length) return;
        let spell = spells.reduce((max, item) => (item.system.level > max.system.level ? item : max));
        await itemUtils.enchantItem(spell, effectData);
    }));
}
export let purgeMindSpellVariant = {
    name: 'Purge Mind (Spell Variant) (6th Level Spell)',
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
                priority: 50
            }
        ]
    }
};