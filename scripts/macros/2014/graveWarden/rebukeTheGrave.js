import {itemUtils, workflowUtils, actorUtils, dialogUtils, effectUtils, socketUtils, genericUtils} from '../../../utils.js';
async function damaged({trigger: {entity: item, token}, ditem}) {
    if (!ditem.isHit || ditem.newHP != 0 || ditem.oldHP === 0) return;
    if (!itemUtils.canUse(item)) return;
    let reactionUsed = actorUtils.hasUsedReaction(item.actor);
    let servantReactionUsed = true;
    let effect = effectUtils.getEffectByIdentifier(item.actor, 'undeadServantDust');
    let summonToken;
    if (effect) {
        summonToken = canvas.scene.tokens.get(effect.flags['chris-premades'].summons.ids[effect.name][0]);
        if (summonToken) {
            servantReactionUsed = actorUtils.hasUsedReaction(summonToken.actor);
        }
    }
    if (reactionUsed && servantReactionUsed) return;
    let selection = await dialogUtils.confirmUseItem(item, {userId: socketUtils.firstOwner(item.actor, true)});
    if (!selection) return;
    let caster = !reactionUsed ? item.actor : summonToken.actor;
    if (!reactionUsed && !servantReactionUsed) {
        caster = await dialogUtils.selectDocumentDialog(item.name, 'AUTOMATEDCRAFTEDCREATIONS.RebukeTheGrave.Reaction', [item.actor, summonToken.actor], {userId: socketUtils.firstOwner(item.actor, true)});
        if (!caster) return;
    }
    if (caster.id != item.actor.id) {
        let itemData = genericUtils.duplicate(item.toObject());
        await workflowUtils.syntheticItemDataRoll(itemData, caster, [token]);
        await genericUtils.update(item, {'system.uses.spent': item.system.uses.spent + 1});
    } else {
        await workflowUtils.syntheticItemRoll(item, [token], {consumeUsage: true, consumeResources: true});
    }
    workflowUtils.negateDamageItemDamage(ditem);
}
export let rebukeTheGrave = {
    name: 'Rebuke the Grave',
    version: '0.0.7',
    rules: 'legacy',
    midi: {
        actor: [
            {
                pass: 'targetApplyDamage',
                macro: damaged,
                priority: 250
            }
        ]
    }
};