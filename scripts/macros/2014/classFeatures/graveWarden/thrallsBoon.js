import {actorUtils, effectUtils, genericUtils, tokenUtils} from '../../../../utils.js';
async function early({trigger, workflow}) {
    if (workflow.activity?.range?.units != 'touch') {
        genericUtils.notify('AUTOMATEDCRAFTEDCREATIONS.ThrallsBoon.WrongType', 'info');
        workflow.aborted = true;
        return;
    }
    let effect = effectUtils.getEffectByIdentifier(workflow.actor, 'undeadServantDust');
    if (!effect) {
        workflow.aborted = true;
        return;
    }
    let summonToken = workflow.token.document.parent.tokens.get(effect.flags['chris-premades'].summons.ids[effect.name][0]);
    if (!summonToken) {
        genericUtils.notify('AUTOMATEDCRAFTEDCREATIONS.ThrallsBoon.TooFar', 'info');
        workflow.aborted = true;
        return;
    }
    await actorUtils.setReactionUsed(summonToken.actor);
}
async function late({workflow}) {
    let effect = effectUtils.getEffectByIdentifier(workflow.actor, 'undeadServantDust');
    if (!effect) return;
    let summonToken = canvas.scene.tokens.get(effect.flags['chris-premades'].summons.ids[effect.name][0]);
    if (!summonToken || tokenUtils.getDistance(workflow.token, summonToken) > 100) {
        genericUtils.notify('AUTOMATEDCRAFTEDCREATIONS.ThrallsBoon.TooFar', 'info');
        return;
    }
    if (actorUtils.hasUsedReaction(summonToken.actor)) {
        genericUtils.notify('AUTOMATEDCRAFTEDCREATIONS.ThrallsBoon.Reaction', 'info');
        return;
    }
    let effectData = {
        name: workflow.item.name,
        img: workflow.item.img,
        origin: workflow.item.uuid,
        duration: {
            seconds: 1
        },
        changes: [
            {
                key: 'flags.midi-qol.rangeOverride.attack.all',
                mode: 0,
                value: 1,
                priority: 20
            }
        ],
        flags: {
            dae: {
                specialDuration: [
                    '1Action'
                ]
            }
        }
    };
    effectUtils.addMacro(effectData, 'midi.actor', ['thrallsBoonTouch']);
    let casterEffect = await effectUtils.createEffect(workflow.actor, effectData);
    await effectUtils.createEffect(summonToken.actor, effectData, {parentEntity: casterEffect});
}
export let thrallsBoon = {
    name: 'Thrall\'s Boon',
    version: '0.0.5',
    rules: 'legacy',
    midi: {
        item: [
            {
                pass: 'rollFinished',
                macro: late,
                priority: 50,
            }
        ]
    }
};
export let thrallsBoonTouch = {
    name: 'Thrall\'s Boon: Touch',
    version: thrallsBoon.version,
    rules: thrallsBoon.rules,
    midi: {
        actor: [
            {
                pass: 'preambleComplete',
                macro: early,
                priority: 50
            }
        ]
    }
};