import {actorUtils, constants, dialogUtils, effectUtils, genericUtils, itemUtils, socketUtils} from '../../../../../utils.js';
async function use({trigger, workflow}) {
    if (!workflow.failedSaves.size || !workflow.activity) return;
    let sourceEffect = workflow.activity.effects[0]?.effect;
    if (!sourceEffect) return;
    let effectData = genericUtils.duplicate(sourceEffect.toObject());
    effectData.origin = sourceEffect.uuid;
    effectData.duration = itemUtils.convertDuration(workflow.activity);
    await Promise.all(workflow.failedSaves.map(async token => {
        if (!token.actor) return;
        let effects = actorUtils.getEffects(token.actor, {includeItemEffects: true});
        await Promise.all(effects.map(async effect => {
            let castLevel = effectUtils.getCastLevel(effect);
            if (!castLevel) return;
            if (castLevel > 8) return;
            let originItem = await effectUtils.getOriginItem(effect);
            if (originItem?.type != 'spell') return;
            await genericUtils.remove(effect);
        }));
        let items = token.actor.items.filter(item => {
            if (!constants.itemTypes.includes(item.type)) return;
            if (!item.system.properties?.has('mgc')) return;
            if (itemUtils.getEffectByIdentifier(item, 'disintegrationRayEffect')) return;
            return true;
        });
        if (!items.length) return;
        let selection;
        if (items.length === 1) {
            selection = items[0];
        } else {
            selection = await dialogUtils.selectDocumentDialog(workflow.item.name, 'AUTOMATEDCRAFTEDCREATIONS.Varakhut.DisjunctiveBlast.Select', items, {sortAlphabetical: true, userId: socketUtils.firstOwner(token.actor, true)});
            if (!selection) selection = items[0];
        }
        await itemUtils.enchantItem(selection, effectData);
    }));
}
export let disjunctiveBlast = {
    name: 'Disjunctive Blast (8th Level Spell)',
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