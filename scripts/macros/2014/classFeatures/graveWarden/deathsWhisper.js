import {activityUtils, spellUtils} from '../../../../utils.js';
async function skill({trigger: {entity: item, skillId}}) {
    if (skillId != 'rel') return;
    return {label: 'AUTOMATEDCRAFTEDCREATIONS.DeathsWhisper.Skill', type: 'advantage'};
}
async function added({trigger: {entity: item}}) {
    let speakWithDead = await spellUtils.getCompendiumSpell('Speak with Dead', {rules: 'legacy'});
    if (!speakWithDead) return;
    let activity = activityUtils.getActivityByIdentifier(item, 'speakWithDead', {strict: true});
    if (!activity) return;
    await activityUtils.correctSpellLink(activity, speakWithDead);
}
export let deathsWhisper = {
    name: 'Death\'s Whisper',
    version: '0.0.5',
    rules: 'legacy',
    skill: [
        {
            pass: 'context',
            macro: skill,
            priority: 50
        }
    ],
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
    ]
};