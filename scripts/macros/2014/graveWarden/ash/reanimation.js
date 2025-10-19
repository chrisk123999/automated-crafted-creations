import {effectUtils, genericUtils} from '../../../../utils.js';
async function use({trigger, workflow}) {
    if (!workflow.targets.size) return;
    let effect = effectUtils.getEffectByIdentifier(workflow.actor, 'undeadServantDust');
    if (!effect) return;
    let summonToken = workflow.token.document.parent.tokens.get(effect.flags['chris-premades'].summons.ids[effect.name][0]);
    if (summonToken?.uuid != workflow.targets.first().document.uuid) return;
    if (summonToken.actor.system.attributes.hp.value) return;
    await genericUtils.update(summonToken.actor, {'system.attributes.hp.value': Math.floor(summonToken.actor.system.attributes.hp.max / 2)});
}
export let reanimation = {
    name: 'Reanimation',
    version: '0.0.10',
    rules: 'legacy',
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