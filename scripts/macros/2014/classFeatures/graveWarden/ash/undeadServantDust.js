import {actorUtils, compendiumUtils, constants, errors, genericUtils, itemUtils, rollUtils, Summons} from '../../../../../utils.js';
async function use({trigger, workflow}) {
    if (!workflow.token) return;
    let sourceActor = await compendiumUtils.getActorFromCompendium('automated-crafted-creations.ACCSummons', 'ACC - Dust Skeleton');
    if (!sourceActor) return;
    let ashenShawlData = await Summons.getSummonItem('Ashen Shawl', {}, workflow.item, {translate: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.AshenShawl.Name', identifier: 'dustAshenShawl', compendium: 'automated-crafted-creations.ACCSummonFeatures'});
    let beguilingAppearanceData = await Summons.getSummonItem('Beguiling Appearance', {}, workflow.item, {translate: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.BeguilingAppearance.Name', identifier: 'dustBeguilingAppearance', compendium: 'automated-crafted-creations.ACCSummonFeatures'});
    let dredgedBreathData = await Summons.getSummonItem('Dredged Breath', {}, workflow.item, {translate: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.DredgedBreath.Name', identifier: 'dustDredgedBreath', compendium: 'automated-crafted-creations.ACCSummonFeatures'});
    let shortbowData = await Summons.getSummonItem('Shortbow', {}, workflow.item, {translate: 'AUTOMATEDCRAFTEDCREATIONS.Generic.Shortbow.Name', identifier: 'dustShortbow', compendium: 'automated-crafted-creations.ACCSummonFeatures'});
    let shortswordData = await Summons.getSummonItem('Shortsword', {}, workflow.item, {translate: 'AUTOMATEDCRAFTEDCREATIONS.Generic.Shortsword.Name', identifier: 'dustShortsword', compendium: 'automated-crafted-creations.ACCSummonFeatures'});
    if (!ashenShawlData || !beguilingAppearanceData || !dredgedBreathData || !shortbowData || !shortswordData) {
        errors.missingPackItem();
        return;
    }
    let name = itemUtils.getConfig(workflow.item, 'name');
    if (!name?.length) name = genericUtils.translate('AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.DustSkeleton.Name');
    let classIdentifier = itemUtils.getConfig(workflow.item, 'classIdentifier');
    let graveWardenLevels = workflow.actor.classes[classIdentifier]?.system?.levels;
    if (!graveWardenLevels) return;
    let formula = graveWardenLevels + 'd8';
    let conASI = itemUtils.getConfig(workflow.item, 'conASI');
    let con = sourceActor.system.abilities.con.value + conASI;
    let conMod = Math.floor((con - 10) / 2);
    let hpFormula = formula + ' + ' + (conMod * graveWardenLevels);
    let rollHitpoints = itemUtils.getConfig(workflow.item, 'rollHitpoints');
    let hitpoints;
    if (rollHitpoints) {
        hitpoints = (await rollUtils.rollDice(hpFormula)).total;
    } else {
        hitpoints = Math.floor((await rollUtils.rollDice(hpFormula, {options: {maximize: true}})).total / 2);
    }
    let updates = {
        actor: {
            name,
            system: {
                details: {
                    cr: actorUtils.getCRFromProf(workflow.actor.system.attributes.prof)
                },
                attributes: {
                    hp: {
                        formula: hitpoints,
                        max: hitpoints,
                        value: hitpoints
                    }
                },
                abilities: {
                    cha: {
                        value: sourceActor.system.abilities.cha.value + itemUtils.getConfig(workflow.item, 'chaASI')
                    },
                    con: {
                        value: sourceActor.system.abilities.con.value + conASI
                    },
                    dex: {
                        value: sourceActor.system.abilities.dex.value + itemUtils.getConfig(workflow.item, 'dexASI')
                    },
                    int: {
                        value: sourceActor.system.abilities.int.value + itemUtils.getConfig(workflow.item, 'intASI')
                    },
                    str: {
                        value: sourceActor.system.abilities.str.value + itemUtils.getConfig(workflow.item, 'strASI')
                    },
                    wis: {
                        value: sourceActor.system.abilities.wis.value + itemUtils.getConfig(workflow.item, 'wisASI')
                    }
                }
            },
            prototypeToken: {
                name,
                disposition: workflow.token.document.disposition
            },
            items: [ashenShawlData, beguilingAppearanceData, dredgedBreathData, shortbowData, shortswordData],
            flags: {
                'automated-crafted-creations': {
                    undeadServant: true
                }
            }
        },
        token: {
            name,
            disposition: workflow.token.document.disposition
        }
    };
    let greaterUndeadServant = itemUtils.getItemByIdentifier(workflow.actor, 'greaterUndeadServant');
    if (greaterUndeadServant) {
        let featPackId = genericUtils.getCPRSetting('featCompendium');
        let featPack = game.packs.get(featPackId);
        if (featPack) {
            let featNames = itemUtils.getConfig(greaterUndeadServant, 'feats');
            if (featNames.length) {
                let feats = (await Promise.all(featNames.map(async name => {
                    return await compendiumUtils.getItemFromCompendium(featPackId, name, {object: true});
                }))).filter(i => i);
                if (feats.length) updates.actor.items.push(...feats);
            }
        }
    }
    let avatarImg = itemUtils.getConfig(workflow.item, 'avatar');
    let tokenImg = itemUtils.getConfig(workflow.item, 'token');
    if (avatarImg) updates.actor.img = avatarImg;
    if (tokenImg) {
        genericUtils.setProperty(updates, 'actor.prototypeToken.texture.src', tokenImg);
        genericUtils.setProperty(updates, 'token.texture.src', tokenImg);
    }
    let animation = itemUtils.getConfig(workflow.item, 'animation');
    await Summons.spawn(sourceActor, updates, workflow.item, workflow.token, {
        duration: itemUtils.convertDuration(workflow.activity).seconds,
        range: workflow.activity.range.value,
        animation,
        initiativeType: 'seperate',
        additionalSummonVaeButtons: [ashenShawlData, beguilingAppearanceData, dredgedBreathData, shortbowData, shortswordData].map(i => ({type: 'use', name: i.name, identifier: i.flags['chris-premades'].info.identifier}))
    });
}
export let undeadServantDust = {
    name: 'Undead Servant (Dust Skeleton)',
    version: '0.0.5',
    rules: 'legacy',
    midi: {
        item: [
            {
                pass: 'rollFinished',
                macro: use,
                priority: 50
            }
        ]
    },
    config: [
        {
            value: 'name',
            label: 'CHRISPREMADES.Summons.CustomName',
            i18nOption: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.DustSkeleton.Name',
            type: 'text',
            default: '',
            category: 'summons'
        },
        {
            value: 'animation',
            label: 'CHRISPREMADES.Config.Animation',
            type: 'select',
            default: 'shadow',
            category: 'animation',
            options: () => {return constants.summonAnimationOptions;}
        },
        {
            value: 'token',
            label: 'CHRISPREMADES.Summons.CustomToken',
            i18nOption: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.DustSkeleton.Name',
            type: 'file',
            default: '',
            category: 'summons'
        },
        {
            value: 'avatar',
            label: 'CHRISPREMADES.Summons.CustomAvatar',
            i18nOption: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.DustSkeleton.Name',
            type: 'file',
            default: '',
            category: 'summons'
        },
        {
            value: 'classIdentifier',
            label: 'CHRISPREMADES.Config.ClassIdentifier',
            type: 'text',
            default: 'grave-warden',
            category: 'homebrew',
            homebrew: true
        },
        {
            value: 'rollHitpoints',
            label: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.RollHP',
            type: 'checkbox',
            default: true,
            category: 'mechanics'
        },
        {
            value: 'chaASI',
            label: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.ChaASI',
            type: 'number',
            default: 0,
            category: 'mechanics'
        },
        {
            value: 'conASI',
            label: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.ConASI',
            type: 'number',
            default: 0,
            category: 'mechanics'
        },
        {
            value: 'dexASI',
            label: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.DexASI',
            type: 'number',
            default: 0,
            category: 'mechanics'
        },
        {
            value: 'intASI',
            label: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.IntASI',
            type: 'number',
            default: 0,
            category: 'mechanics'
        },
        {
            value: 'strASI',
            label: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.StrASI',
            type: 'number',
            default: 0,
            category: 'mechanics'
        },
        {
            value: 'wisASI',
            label: 'AUTOMATEDCRAFTEDCREATIONS.UndeadServantDust.WisASI',
            type: 'number',
            default: 0,
            category: 'mechanics'
        }
    ],
    hasAnimation: true
};