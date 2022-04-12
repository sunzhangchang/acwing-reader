import { core } from 'core'
import { logger } from './utils'
import 'allMods'

$(() => {
    'use strict'
    logger.info('Launching')
    // logger.warn(core.modMan.mods)
    core.runMods()
})
